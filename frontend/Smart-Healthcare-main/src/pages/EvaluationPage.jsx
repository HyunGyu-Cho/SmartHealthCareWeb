import Header from "../components/Header";
import Footer from "../components/Footer";
import EvaluationForm from "../components/EvaluationForm";
import EvaluationList from "../components/EvaluationList";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import HeroWithBg from "../components/HeroWithBg";
import SectionWithWave from "../components/SectionWithWave";

export default function EvaluationPage() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  // 후기 목록 불러오기
  const fetchEvaluations = async () => {
    setListLoading(true);
    const res = await fetch("/api/evaluations");
    const data = await res.json();
    setEvaluations(data);
    setListLoading(false);
  };
  useEffect(() => { fetchEvaluations(); }, []);

  // 제출 핸들러
  const handleSubmit = async ({ rating, comment }) => {
    setLoading(true);
    setSuccessMsg("");
    await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    setLoading(false);
    setSuccessMsg("후기가 성공적으로 등록되었습니다!");
    await fetchEvaluations();
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto mt-24 p-8 bg-white rounded-2xl shadow-lg">
        <HeroWithBg
          title="서비스 평가하기"
          subtitle={"별점과 의견을 남겨주시면\n더 나은 서비스로 보답합니다."}
          bgImage="/assets/feedback-bg.jpg"
        />
        <SectionWithWave bgColor="bg-white">
          <div className="max-w-lg mx-auto text-center mb-8">
            <p className="text-gray-600 text-lg">
              전체적인 만족도, UX/UI, 추천 정확도 등<br />
              자유롭게 평가해주세요.
            </p>
          </div>
        </SectionWithWave>
        <main className="flex-1 flex flex-col items-center justify-center py-10">
          <EvaluationForm onSubmit={handleSubmit} loading={loading} />
          {successMsg && <div className="text-green-600 font-bold mb-4">{successMsg}</div>}
          <section className="w-full max-w-xl">
            <h3 className="font-bold text-lg mb-4">후기 목록</h3>
            <EvaluationList evaluations={evaluations} loading={listLoading} />
          </section>
        </main>
      </div>
    </Layout>
  );
}