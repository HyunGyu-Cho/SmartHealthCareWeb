// src/pages/BodyAnalysisPage.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { BarChart2, CheckCircle2 } from 'lucide-react';
import HeroWithBg from '../components/HeroWithBg';
import SectionWithWave from '../components/SectionWithWave';
import { useEffect, useState } from 'react';

export default function BodyAnalysisPage() {
  const { inbody, survey } = useLocation().state || {};
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState({});
  const [diets, setDiets] = useState({});
  const [loading, setLoading] = useState(true);
  const [bodyType, setBodyType] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (!inbody || !survey) {
      alert('인바디와 설문 데이터를 모두 입력해 주세요!');
      navigate('/inbody');
      return;
    }

    // 체형분석
    fetch('/api/classify-body', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inbody),
    })
      .then(res => res.json())
      .then(data => {
        setBodyType(data.bodyType || '');
        setSummary(data.summary || '');
      })
      .catch(() => {
        setBodyType('');
        setSummary('');
      });

    // 운동/식단 추천
    Promise.all([
      fetch('/api/recommend-workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inbody, survey }),
      }).then(res => res.json()),
      fetch('/api/recommend-diets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inbody, survey }),
      }).then(res => res.json()),
    ])
      .then(([workoutData, dietData]) => {
        setWorkouts(workoutData.workouts || {});
        setDiets(dietData.diets || {});
      })
      .finally(() => setLoading(false));
  }, [inbody, survey, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-16 text-xl text-blue-500">로딩 중...</div>
      </Layout>
    );
  }

  // 대표 운동 추출
  const firstWorkoutDay = Object.keys(workouts)[0];
  const firstWorkout = workouts[firstWorkoutDay]?.[0];
  // 대표 식단 추출: 첫 번째 요일의 첫 끼니
  const firstDietDay = Object.keys(diets)[0];
  const firstDiet = firstDietDay
    ? Object.values(diets[firstDietDay] || {})[0]
    : null;

  return (
    <Layout>
      <HeroWithBg
        title="체형 분석 결과"
        subtitle={"입력하신 인바디 데이터를 기반으로\nAI가 체형을 종합 분석했습니다."}
        bgImage="/assets/analysis-bg.jpg"
      />
      <SectionWithWave bgColor="bg-white">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-gray-600 text-lg">
            상체·하체 근육량, 체지방률, 골격근 지수 등<br />
            다양한 지표를 시각화하여 보여드립니다.
          </p>
        </div>
      </SectionWithWave>

      {/* 분석 결과 */}
      <section className="bg-gradient-to-tr from-blue-100 via-blue-50 to-pink-50 rounded-3xl shadow-2xl p-10 mb-12 flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4">
          <BarChart2 className="w-16 h-16 text-primary" />
          <h2 className="text-4xl font-extrabold text-primary">체형 분석 결과</h2>
        </div>
        <div className="text-2xl font-bold text-blue-600 mb-2">
          {bodyType || <span className="text-gray-400">(분석 정보 없음)</span>}
        </div>
        <span className="inline-flex items-center gap-2 text-green-600 text-lg mb-6">
          <CheckCircle2 className="w-6 h-6" /> AI 분석 완료
        </span>
        <div className="text-lg text-gray-700 text-center max-w-xl mb-6">
          {summary || '(요약 정보 없음)'}
        </div>
      </section>

      {/* 추천 미리보기 */}
      <section className="w-full py-16 px-4 flex flex-col items-center justify-center min-h-[380px] bg-transparent">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 md:gap-24 items-center justify-center">

          {/* 대표 운동 */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full flex flex-col items-center">
              <div className="font-semibold text-2xl mb-3 text-primary">운동 추천</div>
              {firstWorkout ? (
                <>
                  <span className="font-bold text-3xl text-blue-700">{firstWorkout.name}</span>
                  <span className="ml-2 text-lg text-gray-500">({firstWorkoutDay})</span>
                  <div className="text-base text-gray-500 mt-2">(상세확인은 버튼 클릭)</div>
                </>
              ) : (
                <div className="text-gray-400 text-xl">(추천 정보 없음)</div>
              )}
            </div>
          </div>

          {/* 대표 식단 */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full flex flex-col items-center">
              <div className="font-semibold text-2xl mb-3 text-primary">식단 추천</div>
              {firstDiet ? (
                <>
                  <span className="font-bold text-3xl text-green-700">{firstDiet.name}</span>
                  <span className="ml-2 text-lg text-gray-500">({firstDietDay})</span>
                  <div className="text-base text-gray-500 mt-2">(자세히 보려면 버튼 클릭)</div>
                </>
              ) : (
                <div className="text-gray-400 text-xl">(추천 정보 없음)</div>
              )}
            </div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col md:flex-row gap-4 mt-12 w-full max-w-3xl justify-center">
          <Button onClick={() => navigate('/inbody')} className="py-4 px-8 text-lg rounded-full shadow-lg font-bold w-full md:w-auto">
            다시 입력하기
          </Button>
          <Button onClick={() => navigate('/workouts', { state: { inbody, survey } })} className="py-4 px-8 text-lg rounded-full shadow-lg font-bold w-full md:w-auto">
            추천 운동 보기
          </Button>
          <Button onClick={() => navigate('/diets', { state: { inbody, survey } })} className="py-4 px-8 text-lg rounded-full shadow-lg font-bold w-full md:w-auto">
            추천 식단 보기
          </Button>
        </div>
      </section>
    </Layout>
  );
}