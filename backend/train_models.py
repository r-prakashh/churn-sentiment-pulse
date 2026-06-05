import pandas as pd
import pickle
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Ensure VADER lexicon is downloaded
print("📥 Downloading NLTK VADER lexicon...")
nltk.download('vader_lexicon', quiet=True)

# ----------------------------------------------------
# 1. AI LAYER: CUSTOMER CHURN PREDICTION (Random Forest)
# ----------------------------------------------------
print("🤖 Training Churn Prediction Model...")

# Load our generated data
df = pd.read_csv("backend/data/customer_data.csv")

# Split features (X) and target label (y)
X = df[["monthly_spend", "tenure_months", "login_frequency", "support_tickets"]]
y = df["churn"]

# Split into 80% training data and 20% testing data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the ML classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate our model
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"📊 Churn Model Accuracy: {accuracy * 100:.2f}%")

# Save the trained ML model weights to disk
with open("backend/ai_models/churn_model.pkl", "wb") as f:
    pickle.dump(model, f)
print("💾 Saved Churn Model to backend/ai_models/churn_model.pkl")

# ----------------------------------------------------
# 2. AI LAYER: TEXT SENTIMENT ANALYSIS (VADER)
# ----------------------------------------------------
print("\n📝 Testing Sentiment Analysis Engine...")
sia = SentimentIntensityAnalyzer()

# Quick test run to verify functionality
sample_review = "This service is absolutely terrible. The system crashes constantly!"
scores = sia.polarity_scores(sample_review)
print(f"Sample Text: '{sample_review}'")
print(f"Calculated Sentiment Compound Score: {scores['compound']} (Negative)")

print("\n🚀 All AI components built and ready for production deployment!")