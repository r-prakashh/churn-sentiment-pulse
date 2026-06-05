import pandas as pd
import numpy as np

# Set seed for reproducibility
np.random.seed(42)
num_customers = 1000

# Generate synthetic behavioral metrics
data = {
    "customer_id": range(1001, 1001 + num_customers),
    "monthly_spend": np.random.uniform(20, 200, num_customers).round(2),
    "tenure_months": np.random.randint(1, 60, num_customers),
    "login_frequency": np.random.randint(1, 30, num_customers),
    "support_tickets": np.random.randint(0, 10, num_customers),
}

df = pd.DataFrame(data)

# Create a logical, non-random Churn rule (High tickets + low login = high chance of churn)
# This gives our ML model actual patterns to learn!
churn_risk = (df['support_tickets'] * 0.4) - (df['login_frequency'] * 0.2) + (df['monthly_spend'] * 0.005)
df['churn'] = (churn_risk > 0).astype(int)

# Save to our data directory
df.to_csv("backend/data/customer_data.csv", index=False)
print("✅ Synthetic dataset successfully generated at backend/data/customer_data.csv!")