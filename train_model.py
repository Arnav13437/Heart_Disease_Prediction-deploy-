"""
Train and save the Heart Disease prediction model.

Run this script once before deploying to generate model.joblib.
Usage:  python train_model.py
"""

import os
import sys
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib


def train_and_save():
    """Train Logistic Regression on the full dataset and save to model.joblib."""
    # Resolve paths relative to this script's location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, "heart_disease_data.csv")
    model_path = os.path.join(script_dir, "model.joblib")

    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        sys.exit(1)

    print("Loading dataset...")
    heart_data = pd.read_csv(csv_path)
    X = heart_data.drop(columns=["target"])
    Y = heart_data["target"]

    # Quick eval split to report accuracy before training on all data
    X_train, X_test, Y_train, Y_test = train_test_split(
        X, Y, test_size=0.2, stratify=Y, random_state=2
    )
    eval_model = LogisticRegression(max_iter=1000)
    eval_model.fit(X_train, Y_train)
    test_acc = accuracy_score(Y_test, eval_model.predict(X_test))
    print(f"Eval accuracy (80/20 split): {test_acc:.4f}")

    # Train on ALL data for maximum production accuracy
    print("Training final model on full dataset...")
    model = LogisticRegression(max_iter=1000)
    model.fit(X, Y)

    print(f"Saving model to {model_path}...")
    joblib.dump(model, model_path)
    print("✅ Model saved successfully. Ready to deploy!")


if __name__ == "__main__":
    train_and_save()
