from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import numpy as np
import joblib
import pandas as pd
import os 
import hashlib
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import f1_score, classification_report

app = Flask(__name__)
# Allow access from the frontend development server
CORS(app, resources={r"/*": {"origins": "*"}}) 

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/samaajseva'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('NGO', 'Donor'), nullable=False)
    cis = db.Column(db.Integer, default=100)
    current_badge = db.Column(db.String(255), default='New Contributor')
    bio = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'cis': self.cis,
            'current_badge': self.current_badge,
            'bio': self.bio,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class UserBadge(db.Model):
    __tablename__ = 'user_badges'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    badge_name = db.Column(db.String(255), nullable=False)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('badges', lazy=True))

# Utility functions for password hashing
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    return hash_password(password) == hashed

# Define model paths (assuming they are in the same ml_backend directory)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "urgency_model.pkl")
ENCODER_PATH = os.path.join(os.path.dirname(__file__), "encoder.pkl")

"""
Two modes supported:
1) Legacy pickle mode using existing encoder/model with fixed columns (/predict endpoint)
2) Dynamic training mode using a CSV dataset specified via ML_DATA_PATH. This exposes:
   - /api/urgency/schema
   - /api/predict_urgency
"""

# Initialize models/encoders for both modes
model = None
encoder = None

# Dynamic model objects
best_model = None
best_model_name = None
features_encoded_columns = None
original_features_df = None

# Define feature order (must match training data order)
feature_cols = ["State", "PeopleAffected", "Domain", "ResourcesRequired", "UrgencyReason", "Timeline"]
cat_cols = ["State", "Domain", "ResourcesRequired", "UrgencyReason", "Timeline"]

def init_legacy_pickle_mode():
    global model, encoder
    try:
        if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
            model = joblib.load(MODEL_PATH)
            encoder = joblib.load(ENCODER_PATH)
            print("✅ Legacy: Model and encoder loaded successfully")
        else:
            print(f"❌ Legacy: Model files not found in {os.path.dirname(__file__)}")
    except Exception as e:
        print("❌ Legacy: Model loading error:", e)
        model = None
        encoder = None


def init_dynamic_training_mode():
    """
    Trains multiple models on the CSV dataset, selects the best by weighted F1,
    and stores the best model, its name, and the one-hot encoded column set.
    """
    global best_model, best_model_name, features_encoded_columns, original_features_df

    data_path = os.environ.get('ML_DATA_PATH')
    # optional default path inside repository
    if not data_path:
        candidate = os.path.join(os.path.dirname(__file__), 'synthetic_ngo_requests_hyper_realistic.csv')
        if os.path.exists(candidate):
            data_path = candidate

    if not data_path or not os.path.exists(data_path):
        print('ℹ️ Dynamic mode disabled: ML_DATA_PATH not set or file not found.')
        return

    try:
        df = pd.read_csv(data_path)
        urgency_map = {'Low': 0, 'Medium': 1, 'High': 2}
        if 'Urgency' not in df.columns:
            print('❌ Dynamic: CSV must contain Urgency column')
            return
        df['Urgency_Encoded'] = df['Urgency'].map(urgency_map)

        # Introduce 5% label noise for robustness as per user code
        np.random.seed(42)
        noise_fraction = 0.05
        n_samples = len(df)
        n_noise = int(noise_fraction * n_samples)
        if n_noise > 0:
            noise_indices = np.random.choice(n_samples, n_noise, replace=False)
            current_labels = df.loc[noise_indices, 'Urgency_Encoded'].values
            def get_new_label(original):
                options = [0, 1, 2]
                options.remove(original)
                return np.random.choice(options)
            new_labels = np.array([get_new_label(label) for label in current_labels])
            df.loc[noise_indices, 'Urgency_Encoded'] = new_labels

        TARGET_COLUMN = 'Urgency_Encoded'
        # Drop target and any known leakage columns
        drop_cols = [col for col in ['Urgency', 'Urgency_Encoded', 'EstimatedCost'] if col in df.columns]
        features = df.drop(columns=drop_cols)
        target = df[TARGET_COLUMN]

        features_encoded = pd.get_dummies(features, drop_first=True)

        X_train, X_test, y_train, y_test = train_test_split(
            features_encoded, target, test_size=0.2, random_state=42, stratify=target
        )

        models = {
            "Logistic Regression": LogisticRegression(max_iter=500, random_state=42, solver='liblinear'),
            "K-Nearest Neighbors": KNeighborsClassifier(n_neighbors=5),
            "Random Forest": RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42),
            "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
        }

        results = []
        for name, mdl in models.items():
            mdl.fit(X_train, y_train)
            y_pred = mdl.predict(X_test)
            weighted_f1 = f1_score(y_test, y_pred, average='weighted')
            report = classification_report(y_test, y_pred, output_dict=True)
            high_f1 = report.get('2', {}).get('f1-score', 0)
            results.append((name, mdl, weighted_f1, high_f1))

        # Sort by weighted F1 then High urgency F1
        results.sort(key=lambda t: (t[2], t[3]), reverse=True)
        best_name, best_mdl, _, _ = results[0]

        best_model = best_mdl
        best_model_name = best_name
        features_encoded_columns = features_encoded.columns
        original_features_df = features

        print(f"✅ Dynamic: Trained best model: {best_model_name}")
    except Exception as e:
        print('❌ Dynamic training failed:', e)


# Initialize both modes
init_legacy_pickle_mode()
init_dynamic_training_mode()

# Authentication Endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        
        # Validate required fields
        if not all([name, email, password, role]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'success': False, 'message': 'Account with this email already exists'}), 400
        
        # Create new user
        hashed_password = hash_password(password)
        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            role=role,
            bio=f"A newly registered {'non-profit organization' if role == 'NGO' else 'community member eager to start contributing'}."
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Add initial badge
        initial_badge = UserBadge(user_id=new_user.id, badge_name='New Contributor')
        db.session.add(initial_badge)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Validate required fields
        if not all([email, password]):
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Verify password
        if not verify_password(password, user.password):
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Login failed: {str(e)}'}), 500

@app.route('/api/auth/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user profile by ID"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Failed to get user: {str(e)}'}), 500

@app.route('/api/auth/init-db', methods=['POST'])
def init_database():
    """Initialize database tables (for development)"""
    try:
        db.create_all()
        return jsonify({'success': True, 'message': 'Database initialized successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Database initialization failed: {str(e)}'}), 500

@app.route("/predict", methods=["POST"])
def predict():
    """
    Endpoint to receive NGO request data, preprocess it, and return an urgency prediction.
    """
    if model is None or encoder is None:
        return jsonify({"error": "ML Model not available or failed to load. Check server console for details."}), 500

    data = request.get_json()

    try:
        # Prepare input dictionary, using the form field names from React
        input_dict = {
            "State": data.get("state", ""),
            "PeopleAffected": int(data.get("peopleAffected", 0)), 
            "Domain": data.get("domain", ""),
            "ResourcesRequired": data.get("resourceType", ""), # Frontend field name is resourceType
            "UrgencyReason": data.get("urgencyReason", ""),
            "Timeline": data.get("timeline", "")
        }
        
        # Prepare features for prediction
        df = pd.DataFrame([input_dict], columns=feature_cols)

        # Apply encoder transform to categorical features
        df.loc[:, cat_cols] = encoder.transform(df[cat_cols])

        # Prepare features array (numpy array)
        features_array = df.values

        # Predict urgency 
        urgency_pred = model.predict(features_array)[0]

        # Predict confidence 
        if hasattr(model, "predict_proba"):
            confidence = float(np.max(model.predict_proba(features_array)))
        else:
            confidence = 0.8 

        return jsonify({
            "status": "success",
            "urgency": str(urgency_pred).upper(), # Ensure output is uppercase (HIGH, MEDIUM, LOW)
            "confidence": round(confidence, 4),
            "timestamp": pd.Timestamp.now().isoformat()
        }), 200

    except Exception as e:
        app.logger.error(f"Prediction processing error: {e}") 
        return jsonify({"error": f"Prediction processing failed: {str(e)}"}), 500


@app.route('/api/urgency/schema', methods=['GET'])
def get_urgency_schema():
    """Return dynamic schema derived from the training dataset for the frontend to render inputs."""
    if best_model is None or features_encoded_columns is None or original_features_df is None:
        return jsonify({"error": "Dynamic urgency model not initialized. Ensure ML_DATA_PATH CSV is available."}), 500

    features_meta = []
    for col in original_features_df.columns:
        if pd.api.types.is_numeric_dtype(original_features_df[col]):
            features_meta.append({
                'name': col,
                'type': 'number',
                'options': None
            })
        else:
            options = sorted([str(v) for v in original_features_df[col].dropna().unique().tolist()])
            features_meta.append({
                'name': col,
                'type': 'select',
                'options': options
            })

    return jsonify({
        'status': 'success',
        'model': best_model_name,
        'features': features_meta,
    })


@app.route('/api/predict_urgency', methods=['POST'])
def predict_urgency_api():
    """Predict using dynamically trained best model with one-hot alignment."""
    if best_model is None or features_encoded_columns is None:
        return jsonify({"error": "Dynamic urgency model not initialized. Ensure ML_DATA_PATH CSV is available."}), 500

    try:
        data = request.get_json(force=True)
        # Expect keys matching original feature columns. Build single-row DataFrame.
        input_df = pd.DataFrame([data])
        # One-hot encode and align to training columns
        input_encoded = pd.get_dummies(input_df, drop_first=True)
        input_encoded = input_encoded.reindex(columns=features_encoded_columns, fill_value=0)
        pred = int(best_model.predict(input_encoded)[0])
        label_map = {0: 'Low', 1: 'Medium', 2: 'High'}
        label = label_map.get(pred, str(pred))
        return jsonify({
            'status': 'success',
            'urgency': label,
            'model': best_model_name,
        })
    except Exception as e:
        app.logger.error(f"Dynamic prediction failed: {e}")
        return jsonify({"error": f"Dynamic prediction failed: {str(e)}"}), 500

if __name__ == "__main__":
    # The server will run on port 5000 by default.
    app.run(debug=True, port=5000)
