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

export default function RecommendedDietListPage() {
  const { inbody, survey } = useLocation().state || {};
  const [selectedDay, setSelectedDay] = useState(days[0].key);
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bodyType, setBodyType] = useState("");
  const [summary, setSummary] = useState("");
  const [dietImages, setDietImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!inbody || !survey) return;
    // 체형 분류 결과 fetch
    fetch('/api/classify-body', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inbody }),
    })
      .then(res => res.json())
      .then(data => {
        setBodyType(data.bodyType || "");
        setSummary(data.summary || "");
      });
    // 식단 추천 fetch
    fetch("/api/recommend-diets", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inbody, survey })
    })
      .then(res => res.json())
      .then(async data => {
        if (data.error) throw new Error(data.error);
        setDiets(data.diets || []);
        // 식단별 이미지 동적 로딩
        const all = {};
        for (const day of days) {
          all[day.key] = await Promise.all(Object.values(data.diets[day.key] || {}).map(async diet => {
            if (diet.imageUrl) return diet.imageUrl;
            return await fetchUnsplashImage(diet.name);
          }));
        }
        setDietImages(all);
      })
      .catch(() => {
        alert("추천 식단 로드 실패");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [inbody, survey, navigate]);

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
        title="추천 식단"
        subtitle={"AI가 분석한 체형·목표를 바탕으로\n맞춤형 식단을 제안합니다."}
        bgImage="/assets/diet-bg.jpg"
      />
      <SectionWithWave bgColor="bg-white">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="text-gray-600 text-lg">
            하루 권장 칼로리, 영양소 비율을 고려한<br />
            맞춤 식단을 확인하고 건강하게 식사하세요.
          </p>
        </div>
      </SectionWithWave>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow">← 뒤로가기</button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-blue-700">체형 분류 결과: {bodyType}</h2>
          <p className="text-gray-700">{summary}</p>
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
          ) : diets[selectedDay] && Object.keys(diets[selectedDay]).length === 0 ? (
            <div className="text-center py-16 text-xl text-gray-500 bg-white rounded-2xl shadow-lg w-full col-span-2">추천 식단이 없습니다.</div>
          ) : (
            Object.entries(diets[selectedDay] || {}).map(([meal, diet], idx) => (
              <Card key={meal} title={`${meal} - ${diet.name}`} className="bg-white text-gray-800 shadow-lg rounded-2xl p-6">
                <img src={dietImages[selectedDay]?.[idx] || diet.imageUrl} alt={diet.name} className="w-full h-40 object-cover rounded-xl mb-2" loading="lazy" />
                <p className="text-gray-700 mb-1">{diet.name}</p>
                <Link to={`/diet/${meal}`} state={{ diet }} className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark text-center">
                  상세보기
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}