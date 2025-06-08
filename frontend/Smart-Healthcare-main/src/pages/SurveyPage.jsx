import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from '../components/Layout';
import Button from '../components/Button';
import HeroWithBg from '../components/HeroWithBg';
import SectionWithWave from '../components/SectionWithWave';

export default function SurveyPage() {
  const { inbody } = useLocation().state || {};
  const [survey, setSurvey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!inbody) {
    return (
      <Layout>
        <div className="text-center py-16 text-xl text-red-500">먼저 인바디 데이터를 입력해 주세요.</div>
      </Layout>
    );
  }

  const handleAnalysis = e => {
    e.preventDefault();
    if (!survey) {
      setError('설문 내용을 입력하세요.');
      return;
    }
    setError("");
    setLoading(true);
    navigate("/analysis", {
      state: { inbody, survey }
    });
  };

  const handleInbody = () => {
    navigate("/inbody");
  };

  return (
    <Layout>
      <HeroWithBg
        title="설문 입력"
        subtitle={"운동/식단 목표, 통증, 선호 등 자유롭게 의견을 입력해 주세요."}
        bgImage="/assets/inbody-bg.jpg"
      />
      <SectionWithWave bgColor="bg-white">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-gray-600 text-lg">
            예: 허리 통증이 있어요. 하체 위주로 운동하고 싶어요.<br />
            원하는 목표, 고민, 선호하는 운동/식단 등을 자유롭게 작성해 주세요.
          </p>
        </div>
      </SectionWithWave>
      <section className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl mx-auto mb-12">
        <form className="space-y-10">
          <div>
            <label className="block mb-2 font-bold text-lg">설문 입력</label>
            <textarea
              className="w-full border rounded-xl p-4 text-lg min-h-[120px] shadow"
              placeholder="예: 허리 통증이 있어요. 하체 위주로 운동하고 싶어요."
              value={survey}
              onChange={e => setSurvey(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <Button
              type="button"
              className="w-full bg-primary text-white py-4 rounded-full text-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loading}
              onClick={handleAnalysis}
            >
              분석 결과 보기
            </Button>
            <Button
              type="button"
              className="w-full bg-gray-400 text-white py-4 rounded-full text-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
              onClick={handleInbody}
            >
              인바디 다시 입력
            </Button>
          </div>
          {error && <div className="mt-4 text-red-500 text-center font-bold text-lg">{error}</div>}
        </form>
      </section>
    </Layout>
  );
} 