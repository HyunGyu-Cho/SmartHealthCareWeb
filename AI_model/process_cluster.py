import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import joblib

# 0) 원본 데이터 로드
INPUT_CSV = "inbody_full.csv"
df = pd.read_csv(INPUT_CSV, encoding="cp949")

# 1) 성별(M/F → 0/1) 매핑
df['성별'] = df['성별'].map({'M': 0, 'F': 1})

# 2) 숫자형 피처만 골라 결측 대체
num_cols = df.select_dtypes(include=["number"]).columns.tolist()
# auto_label, 체질량지수 제거
for drop_col in ("auto_label", "체질량지수"):
    if drop_col in num_cols:
        num_cols.remove(drop_col)

# 입력 데이터 준비 (성별 포함)
X = df[num_cols].copy().fillna(df[num_cols].median())

# 3) 표준화
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 4) KMeans 클러스터링
N_CLUSTERS = 11
kmeans = KMeans(n_clusters=N_CLUSTERS, random_state=42, n_init=10)
clusters = kmeans.fit_predict(X_scaled)
df["auto_label"] = clusters

# 5) 클러스터 → 체형 레이블 매핑
cluster_to_label = {
    0: "적정", 1: "과체중", 2: "약간마름", 3: "운동선수급",
    4: "날씬", 5: "비만", 6: "경도비만", 7: "근육형 날씬",
    8: "마른비만", 9: "근육형", 10: "기타"
}
df["body_type"] = df["auto_label"].map(cluster_to_label)

# 6) 결과 CSV 저장
FINAL_CSV = "inbody_final_2_labeled.csv"
df.to_csv(FINAL_CSV, index=False, encoding="utf-8-sig")

# 7) 파이프라인 아티팩트 저장 (scaler, kmeans, mapping, num_cols)
joblib.dump({
    "scaler": scaler,
    "kmeans": kmeans,
    "mapping": cluster_to_label,
    "num_cols": num_cols
}, "preprocess_and_cluster.pkl")

print(f"Saved final labeled CSV to {FINAL_CSV} and pipeline to preprocess_and_cluster.pkl")
