import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useState, useEffect } from 'react';
import { BarChart2, ArrowRight } from 'lucide-react';
import { fetchFeatureList, fetchSurveyAnalysis } from '../api/openai';
import HeroWithBg from '../components/HeroWithBg';
import SectionWithWave from '../components/SectionWithWave';

export default function InbodyInputPage() {
  const [features, setFeatures] = useState([]);
  const [form, setForm] = useState({});
  const [survey, setSurvey] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeatureList()
      .then(data => setFeatures(Array.isArray(data) ? data : data.features))
      .catch(() => setError('입력 항목 정보를 불러오지 못했습니다.'));
  }, []);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInbodySubmit = e => {
    e.preventDefault();
    for (const col of features) {
      if (!form[col]) {
        setError(`${col}을(를) 입력하세요.`);
        return;
      }
    }
    setError('');
    setStep(2);
    navigate('/survey', { state: { inbody: form } });
  };

  const handleRecommend = async e => {
    e.preventDefault();
    if (!survey) {
      setError('설문 내용을 입력하세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const inbody = {};
      for (const col of features) {
        let v = form[col];
        if (col === '성별') v = v === '남성' ? 'M' : 'F';
        else v = Number(v);
        inbody[col] = v;
      }
      const analysis = await fetchSurveyAnalysis(survey, inbody);
      navigate('/analysis', {
        state: {
          ...analysis,
          inbody,
          survey
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <HeroWithBg
        title="인바디 데이터 입력"
        subtitle={"정확한 건강 분석을 위해\n인바디 데이터를 입력해 주세요."}
        bgImage="/assets/inbody-bg.jpg"
      />
      <SectionWithWave bgColor="bg-white">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-gray-600 text-lg">
            키, 체중, 체지방률, 근육량 등 주요 인바디 데이터를 입력하면<br />
            AI가 맞춤 분석을 시작합니다.
          </p>
        </div>
      </SectionWithWave>
      {/* Form Section */}
      <section className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl mx-auto mb-12">
        {step === 1 ? (
          <form onSubmit={handleInbodySubmit} className="space-y-12">
            {features.length === 0 ? (
              <div className="text-center text-gray-400 text-xl">입력 항목을 불러오는 중...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map(col => (
                  <div key={col}>
                    <label className="block mb-2 font-bold text-lg">{col}</label>
                    {col === '성별' ? (
                      <select
                        name={col}
                        value={form[col] || ''}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-4 text-lg focus:ring-2 focus:ring-primary shadow"
                        required
                      >
                        <option value="">선택하세요</option>
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                      </select>
                    ) : (
                      <input
                        name={col}
                        type="number"
                        value={form[col] || ''}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-4 text-lg focus:ring-2 focus:ring-primary shadow"
                        placeholder={`${col}을(를) 입력하세요`}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-full text-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loading || features.length === 0}
            >
              다음 (설문 입력)
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRecommend} className="space-y-10">
            <div>
              <label className="block mb-2 font-bold text-lg">
                자유롭게 의견을 입력해 주세요 (운동/식단 목표, 통증, 선호 등)
              </label>
              <textarea
                className="w-full border rounded-xl p-4 text-lg min-h-[120px] shadow"
                placeholder="예: 허리 통증이 있어요. 하체 위주로 운동하고 싶어요."
                value={survey}
                onChange={e => setSurvey(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-full text-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? <ArrowRight className="animate-spin" /> : <ArrowRight />}
              추천받기
            </Button>
          </form>
        )}
        {error && <div className="mt-8 text-red-500 text-center font-bold text-lg">{error}</div>}
      </section>
    </Layout>
  );
}