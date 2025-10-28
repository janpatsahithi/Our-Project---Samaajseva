#!/usr/bin/env python3
"""
Database setup script for Samaajseva project
Run this script to initialize the database and create sample data
"""

import requests
import json

def init_database():
    """Initialize the database tables"""
    try:
        response = requests.post('http://localhost:5000/api/auth/init-db')
        if response.status_code == 200:
            print("✅ Database initialized successfully")
            return True
        else:
            print(f"❌ Database initialization failed: {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Flask server. Make sure the backend is running on port 5000")
        return False
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        return False

def create_sample_users():
    """Create sample users for testing"""
    sample_users = [
        {
            "name": "Sample NGO",
            "email": "ngo@example.com",
            "password": "password123",
            "role": "NGO"
        },
        {
            "name": "Sample Donor",
            "email": "donor@example.com", 
            "password": "password123",
            "role": "Donor"
        }
    ]
    
    for user in sample_users:
        try:
            response = requests.post('http://localhost:5000/api/auth/register', 
                                  json=user,
                                  headers={'Content-Type': 'application/json'})
            if response.status_code == 201:
                print(f"✅ Created sample user: {user['name']}")
            else:
                print(f"⚠️ User {user['name']} might already exist: {response.text}")
        except Exception as e:
            print(f"❌ Error creating user {user['name']}: {e}")

def test_login():
    """Test login functionality"""
    try:
        response = requests.post('http://localhost:5000/api/auth/login',
                               json={"email": "ngo@example.com", "password": "password123"},
                               headers={'Content-Type': 'application/json'})
        if response.status_code == 200:
            print("✅ Login test successful")
            return True
        else:
            print(f"❌ Login test failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Login test error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Setting up Samaajseva Database...")
    print("=" * 50)
    
    # Step 1: Initialize database
    if init_database():
        print("\n📝 Creating sample users...")
        create_sample_users()
        
        print("\n🔐 Testing authentication...")
        test_login()
        
        print("\n" + "=" * 50)
        print("✅ Database setup complete!")
        print("\nYou can now:")
        print("1. Login with ngo@example.com / password123 (NGO)")
        print("2. Login with donor@example.com / password123 (Donor)")
        print("3. Register new users through the frontend")
    else:
        print("\n❌ Database setup failed. Please check:")
        print("1. XAMPP MySQL is running")
        print("2. Flask backend is running (python app.py)")
        print("3. Database 'samaajseva' exists in MySQL")
