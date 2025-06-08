from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, traceback
import numpy as np
from dotenv import load_dotenv

# ─── 0) 환경변수 로드 & 앱 초기화 ────────────────────────────────────────────
load_dotenv()
app = Flask(__name__)
CORS(app)

# ─── 1) 파이프라인 로드 ──────────────────────────────────────────────────────
pipeline = joblib.load("preprocess_and_cluster.pkl")
scaler   = pipeline["scaler"]
num_cols = pipeline["num_cols"]
kmeans   = pipeline["kmeans"]
mapping  = pipeline["mapping"]    # {클러스터ID: 체형문자열} :contentReference[oaicite:0]{index=0}

# ─── 2) 체형 예측 헬퍼 함수 ──────────────────────────────────────────────────
def predict_body_type(inbody: dict) -> str:
    if not isinstance(inbody, dict):
        raise ValueError("입력값이 딕셔너리가 아닙니다.")
    if "성별" not in inbody:
        raise KeyError("입력 데이터에 '성별' 키가 없습니다.")
    # 이미 숫자(0/1) 변환이 되어 있어야 함
    raw = []
    for col in num_cols:
        if col not in inbody:
            raise KeyError(f"입력 데이터에 '{col}' 컬럼이 없습니다.")
        raw.append(float(inbody[col]))
    Xs = scaler.transform(np.array(raw).reshape(1, -1))
    cid = int(kmeans.predict(Xs)[0])
    return mapping.get(cid, "Unknown")

# ─── 3) 입력 폼용 컬럼 리스트 ─────────────────────────────────────────────────
@app.route("/feature-list", methods=["GET"])
def feature_list():
    return jsonify({"features": num_cols})

# ─── 4) 체형 분류 엔드포인트 ─────────────────────────────────────────────────
@app.route("/classify-body", methods=["POST"])
def classify_body():
    payload = request.get_json(force=True)
    # BodyClassificationService.java 에서 Map.of("inbody", inbody) 로 보냄 :contentReference[oaicite:1]{index=1}
    inbody = payload.get("inbody", payload)

    # 클라이언트에서 '남성'/'여성' 문자열로 보냈다면 M/F → 0/1 변환
    if "성별" in inbody and isinstance(inbody["성별"], str):
        inbody["성별"] = 0 if inbody["성별"] == "M" else 1

    try:
        bt = predict_body_type(inbody)
        summary = f"분석 결과: {bt} 체형입니다."
        return jsonify({ "bodyType": bt, "summary": summary })
    except Exception as e:
        tb = traceback.format_exc()
        return jsonify({ "error": str(e), "traceback": tb }), 500

# ─── 5) 서버 실행 ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
