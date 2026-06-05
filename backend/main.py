from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Initialize FastAPI application
app = FastAPI(title="Churn & Sentiment Pulse API")

# Enable CORS (Cross-Origin Resource Sharing)
# This allows our future React frontend to securely talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits requests from any origin for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Sentiment Analyzer
sia = SentimentIntensityAnalyzer()

# Load our pre-trained Machine Learning Churn Model
try:
    with open("backend/ai_models/churn_model.pkl", "rb") as f:
        churn_model = pickle.load(f)
except FileNotFoundError:
    raise RuntimeError("❌ Churn model weights not found! Run train_models.py first.")

# Define the structure of incoming data using Pydantic for automated validation
class CustomerData(BaseModel):
    monthly_spend: float
    tenure_months: int
    login_frequency: int
    support_tickets: int
    review_text: str

# --- API ENDPOINTS ---

@app.get("/")
def home():
    """Health-check endpoint to verify the server is live."""
    return {"status": "online", "message": "MNC Churn Engine Operational"}

@app.post("/predict")
def predict_churn_and_sentiment(customer: CustomerData):
    """
    Core AI Endpoint: Accepts customer behavioral logs + feedback text.
    Returns calculated sentiment metrics and percentage risk of churning.
    """
    try:
        # 1. Calculate Text Sentiment
        sentiment_scores = sia.polarity_scores(customer.review_text)
        compound_score = sentiment_scores["compound"]
        
        # Categorize sentiment based on score thresholds
        if compound_score >= 0.05:
            sentiment_label = "Positive"
        elif compound_score <= -0.05:
            sentiment_label = "Negative"
        else:
            sentiment_label = "Neutral"

        # 2. Extract features for the ML model in the exact order it was trained
        features = [[
            customer.monthly_spend,
            customer.tenure_months,
            customer.login_frequency,
            customer.support_tickets
        ]]
        
        # 3. Predict Churn Probability
        # predict_proba returns [prob_of_0, prob_of_1]. We want prob_of_1 (Churn Risk)
        churn_probability = churn_model.predict_proba(features)[0][1]

        # 4. Construct response payload
        return {
            "sentiment": {
                "score": compound_score,
                "label": sentiment_label
            },
            "churn_prediction": {
                "risk_score": round(float(churn_probability) * 100, 2),
                "will_churn": bool(churn_probability > 0.5)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")