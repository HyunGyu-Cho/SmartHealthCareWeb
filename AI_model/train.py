import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score

# 1) 라벨링된 데이터 로드
df = pd.read_csv("inbody_final_2_labeled.csv", encoding="utf-8-sig")

# 2) 성별은 이미 0/1 매핑됨

# 3) 전처리 파이프라인 로드
pipeline = joblib.load("preprocess_and_cluster.pkl")
scaler   = pipeline["scaler"]
num_cols = pipeline["num_cols"]  # 여기엔 '성별' 포함되어 있음

# 4) 입력(X) 준비: DataFrame 형태로 피처 순서 보존
X_df = df[num_cols].copy().fillna(0)
X = scaler.transform(X_df)

# 5) 레이블(y) 준비
le = LabelEncoder()
y = le.fit_transform(df["body_type"])

# 6) 훈련/검증 분리
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 7) MLPClassifier 생성 및 학습
clf = MLPClassifier(
    hidden_layer_sizes=(128, 64, 32),
    activation='relu',
    solver='adam',
    alpha=1e-4,
    batch_size=64,
    learning_rate_init=1e-3,
    max_iter=200,
    random_state=42,
    verbose=True
)
clf.fit(X_train, y_train)

# 8) 평가
y_pred = clf.predict(X_val)
print("Accuracy:", accuracy_score(y_val, y_pred))
print(classification_report(y_val, y_pred, target_names=le.classes_))

# 9) 모델 및 레이블 인코더 저장
joblib.dump(clf, "mlp_classifier_sklearn.pkl")
joblib.dump(le,  "label_encoder.pkl")
