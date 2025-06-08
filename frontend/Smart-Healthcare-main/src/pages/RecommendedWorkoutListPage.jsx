import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HeroWithBg from '../components/HeroWithBg';
import SectionWithWave from '../components/SectionWithWave';
import { fetchUnsplashImage } from '../api/unsplash';

const days = [
  { key: 'Monday', label: '월요일' },
  { key: 'Tuesday', label: '화요일' },
  { key: 'Wednesday', label: '수요일' },
  { key: 'Thursday', label: '목요일' },
  { key: 'Friday', label: '금요일' }
];

export default function RecommendedWorkoutListPage() {
  const { inbody, survey } = useLocation().state || {};
  const [selectedDay, setSelectedDay] = useState(days[0].key);
  const [workouts, setWorkouts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bodyType, setBodyType] = useState("");
  const [summary, setSummary] = useState("");
  const [workoutImages, setWorkoutImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!inbody || !survey) return;
    // 체형 분류 결과 fetch
    fetch('/api/classify-body', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inbody),
    })
      .then(res => res.json())
      .then(data => {
        setBodyType(data.bodyType || "");
        setSummary(data.summary || "");
      });
    // 운동 추천 fetch
    fetch('/api/recommend-workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inbody, survey }),
    })
      .then(res => res.json())
      .then(async data => {
        if (data.error) throw new Error(data.error);
        setWorkouts(data.workouts);
        // 운동별 이미지 동적 로딩
        const all = {};
        for (const day of days) {
          all[day.key] = await Promise.all((data.workouts[day.key] || []).map(async w => {
            if (w.imageUrl) return w.imageUrl;
            return await fetchUnsplashImage(w.name);
          }));
        }
        setWorkoutImages(all);
      })
      .catch(() => {
        alert("추천 운동 로드 실패");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [inbody, survey, navigate]);

  // 오늘 운동 완료 기록 저장
  const handleCompleteToday = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const payload = JSON.stringify(workouts[selectedDay] || []);
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // TODO: 실제 로그인 사용자 ID로 대체
          date: today,
          type: 'workout',
          payload,
          completed: true
        })
      });
      if (!res.ok) throw new Error('기록 저장 실패');
      alert('오늘의 운동 완료 기록이 저장되었습니다!');
    } catch (e) {
      alert('기록 저장 실패: ' + e.message);
    }
  };

  if (!inbody || !survey) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">인바디 데이터와 설문 데이터가 필요합니다.</p>
          <button onClick={() => navigate('/inbody')} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
            인바디 입력하기
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroWithBg
        title="추천 운동 루틴"
        subtitle={"AI가 분석한 체형·목표를 바탕으로\n맞춤형 운동 루틴을 제안합니다."}
        bgImage="/assets/workout-bg.jpg"
      />
      <SectionWithWave bgColor="bg-white">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-gray-600 text-lg">
            주요 근육군, 난이도, 소요 시간을 한눈에 확인하고<br />
            단계별 가이드와 데모 영상으로 정확한 동작법을 익히세요.
          </p>
        </div>
      </SectionWithWave>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow">← 뒤로가기</button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-blue-700">
            체형 분류 결과: {bodyType ? bodyType : <span className="text-gray-400">(분석 정보 없음)</span>}
          </h2>
          <p className="text-gray-700">{summary || <span className="text-gray-400">(요약 정보 없음)</span>}</p>
        </div>
      </div>
      <div className="flex gap-8">
        <aside className="w-32 space-y-2">
          {days.map(d => (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`w-full py-2 rounded ${d.key === selectedDay ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {d.label}
            </button>
          ))}
        </aside>

        <div className="flex-1 grid md:grid-cols-2 gap-6">
          {loading ? (
            <div className="text-center py-16 text-xl text-blue-500 bg-white rounded-2xl shadow-lg w-full col-span-2">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-16 text-xl text-red-500 bg-white rounded-2xl shadow-lg w-full col-span-2">{error}</div>
          ) : (
            (workouts[selectedDay] || []).map((w, idx) => (
              <Card key={w.id} title={w.name} className="bg-white text-gray-800 shadow-lg rounded-2xl p-6">
                <img src={workoutImages[selectedDay]?.[idx] || w.imageUrl} alt={w.name} className="w-full h-40 object-cover rounded-xl mb-2" loading="lazy" />
                <p className="text-gray-700 mb-1">{w.name}</p>
                <Link to={`/workout/${w.id}`} state={{ workout: w }} className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark text-center">
                  상세보기
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button onClick={handleCompleteToday} className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full shadow-lg text-lg">
          오늘 운동 완료
        </button>
      </div>
    </Layout>
  );
}