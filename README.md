# Churn & Sentiment Pulse: Enterprise Account Diagnostics Platform

An asynchronous, full-stack predictive analytics platform that evaluates corporate client attrition risks by pairing traditional machine learning classifiers with Natural Language Processing (NLP) text analytics. 

This repository implements a decoupled, event-driven architecture featuring a high-performance **FastAPI microservice backend** and a responsive **React/Tailwind CSS executive dashboard frontend**.

---

## 🎯 Platform Architecture & Highlights

The application functions as an end-to-end data pipeline divided into three decoupled layers:

1. **Analytical Data Engine (Python / Scikit-Learn / NLTK):**
   * Generates localized enterprise telemetry simulation data capturing financial spend patterns, service tenure, and engagement frequencies.
   * Trains and serializes a standard binary classification pipeline (`RandomForestClassifier`) optimized to predict client churn probability.
   * Leverages a rule-based lexical sentiment engine (`NLTK VADER`) to map subjective user review logs to quantitative text intensity scores.

2. **Microservice Backend API Layer (FastAPI / Uvicorn):**
   * Exposes a low-latency asynchronous `POST /predict` endpoint to process inbound payload records.
   * Facilitates cross-origin resource sharing (CORS) middle-tier integration to safely serve state operations to web layers.

3. **Executive UI Dashboard Frontend (React / Tailwind CSS):**
   * Presents diagnostic control sliders to simulate live account metrics.
   * Renders real-time visual indicator badges (emerald-to-crimson scales) mapping backend-calculated probability models instantly onto user panels.

---

## 📁 Repository Structure

```text
churn-sentiment-pulse/
├── backend/
│   ├── ai_models/          # Serialized model weights (Joblib binaries)
│   ├── data/              # Feature sets & customer telemetry logs
│   ├── generate_data.py   # Script simulating enterprise transaction histories
│   ├── train_models.py    # Sklearn model orchestration and scoring routines
│   └── main.py            # FastAPI service routing engine
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Component managing layout & state integration
│   │   ├── index.css      # Custom stylesheet with Tailwind base bindings
│   │   └── main.jsx       # Document Object Model (DOM) root rendering node
│   ├── index.html         # Application entry point shell
│   └── package.json       # Node package manager environment lock files
└── .gitignore             # Global build and runtime system exclusions
