from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import pandas as pd
import os 

app = Flask(__name__)
# Allow access from the frontend development server
CORS(app, resources={r"/predict": {"origins": "*"}}) 

# Define model paths (assuming they are in the same ml_backend directory)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "urgency_model.pkl")
ENCODER_PATH = os.path.join(os.path.dirname(__file__), "encoder.pkl")

# Initialize model and encoder to None
model = None
encoder = None

# Define feature order (must match training data order)
feature_cols = ["State", "PeopleAffected", "Domain", "ResourcesRequired", "UrgencyReason", "Timeline"]
cat_cols = ["State", "Domain", "ResourcesRequired", "UrgencyReason", "Timeline"]

# Load model and encoder during application startup
try:
    if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
        model = joblib.load(MODEL_PATH)
        encoder = joblib.load(ENCODER_PATH)
        print("✅ Model and encoder loaded successfully")
    else:
        print(f"❌ Model files not found in {os.path.dirname(__file__)}")
except Exception as e:
    print("❌ Model loading error:", e)
    model = None
    encoder = None

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

if __name__ == "__main__":
    # The server will run on port 5000 by default.
    app.run(debug=True, port=5000)
