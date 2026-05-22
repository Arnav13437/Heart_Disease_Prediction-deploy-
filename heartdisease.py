"""
Heart Disease Prediction System — Local Development Script

This script is for local development and exploration only.
For production deployment, see api/index.py (Vercel serverless function).
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score


def explore_and_train():
    """Load the dataset, explore it, train a model, and evaluate it."""

    # ─── Data Collection and Processing ───────────────────────────────────
    heart_data = pd.read_csv("heart_disease_data.csv")

    print("── First 5 rows ──")
    print(heart_data.head())

    print("\n── Dataset shape ──")
    print(f"  Rows: {heart_data.shape[0]}, Columns: {heart_data.shape[1]}")

    print("\n── Missing values ──")
    missing = heart_data.isnull().sum()
    if missing.sum() == 0:
        print("  None — dataset is complete.")
    else:
        print(missing[missing > 0])

    print("\n── Target distribution ──")
    print(heart_data["target"].value_counts().to_string())
    print("  1 → Defective Heart (Heart Disease Present)")
    print("  0 → Healthy Heart (No Heart Disease)")

    # ─── Splitting Features and Target ────────────────────────────────────
    X = heart_data.drop(columns=["target"])
    Y = heart_data["target"]

    # ─── Train / Test Split ───────────────────────────────────────────────
    X_train, X_test, Y_train, Y_test = train_test_split(
        X, Y, test_size=0.2, stratify=Y, random_state=2
    )
    print(f"\n── Split sizes ──")
    print(f"  Full: {X.shape[0]} | Train: {X_train.shape[0]} | Test: {X_test.shape[0]}")

    # ─── Model Training ──────────────────────────────────────────────────
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, Y_train)

    # ─── Model Evaluation ─────────────────────────────────────────────────
    train_acc = accuracy_score(Y_train, model.predict(X_train))
    test_acc = accuracy_score(Y_test, model.predict(X_test))
    print(f"\n── Accuracy ──")
    print(f"  Training: {train_acc:.4f}")
    print(f"  Testing:  {test_acc:.4f}")

    return model


if __name__ == "__main__":
    explore_and_train()