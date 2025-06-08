import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import Card from '../components/Card';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUnsplashImage } from '../api/unsplash';
import { Utensils, Flame, Timer, Info, AlertTriangle, Apple } from 'lucide-react';

export default function DietDetailPage() {
  const { diet } = useLocation().state || {};
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (diet) {
      setDetail(diet);
      fetchUnsplashImage(diet.name).then(url => setImageUrl(url || diet.imageUrl));
      setLoading(false);
    } else {
      setError('식단 정보를 불러올 수 없습니다.');
      setLoading(false);
    }
  }, [diet]);

  // 태그/카테고리 예시 추출
  const tags = detail?.tags || [detail?.category, detail?.recommendedTime].filter(Boolean);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-16">로딩 중...</div>
      </Layout>
    );
  }

  if (error || !detail) {
    return (
      <Layout>
        <div className="text-center py-16">{error || '식단 정보를 찾을 수 없습니다.'}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <button onClick={() => navigate(-1)} className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow">← 뒤로가기</button>
      <Card title={detail.name} className="bg-white text-gray-800 shadow-lg rounded-2xl p-8">
        {/* 대표 이미지 + 식단명 + 태그/뱃지 */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <img
            src={imageUrl || detail.imageUrl}
            alt={detail.name}
            className="w-64 h-64 object-cover rounded-3xl shadow-lg border-4 border-yellow-200 bg-white"
          />
          <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{detail.name}</h1>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags && tags.map((tag, i) => (
                <span key={i} className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-300">#{tag}</span>
              ))}
            </div>
            {/* 요약 카드 */}
            <div className="flex gap-4 mt-2">
              <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-2 shadow">
                <Flame className="text-orange-400 mb-1" />
                <span className="text-xs text-gray-500">칼로리</span>
                <span className="font-bold text-lg">{detail.nutrients?.calories || '-'} kcal</span>
              </div>
              <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-2 shadow">
                <Apple className="text-green-400 mb-1" />
                <span className="text-xs text-gray-500">탄수</span>
                <span className="font-bold text-lg">{detail.nutrients?.carbs || '-'}g</span>
              </div>
              <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-2 shadow">
                <Utensils className="text-blue-400 mb-1" />
                <span className="text-xs text-gray-500">단백질</span>
                <span className="font-bold text-lg">{detail.nutrients?.protein || '-'}g</span>
              </div>
              <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-2 shadow">
                <Timer className="text-purple-400 mb-1" />
                <span className="text-xs text-gray-500">지방</span>
                <span className="font-bold text-lg">{detail.nutrients?.fat || '-'}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보: 설명, 추천 이유, 재료, 조리법 등 */}
        <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
          <div>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Info className="text-blue-400" /> 설명</h2>
            <p className="text-gray-800 mb-4">{detail.description || '(설명 없음)'}</p>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Flame className="text-orange-400" /> 추천 이유</h2>
            <p className="text-green-800 mb-4">{detail.reason || '(추천 이유 없음)'}</p>
            {detail.infoUrl && (
              <a
                href={detail.infoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded-full font-bold shadow hover:bg-blue-600 transition"
              >
                음식 소개 보러가기
              </a>
            )}
          </div>
          <div>
            {detail.ingredients && (
              <>
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Utensils className="text-blue-400" /> 재료</h2>
                <ul className="list-disc ml-6 text-gray-800 mb-4">
                  {Array.isArray(detail.ingredients)
                    ? detail.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)
                    : <li>{detail.ingredients}</li>}
                </ul>
              </>
            )}
            {detail.instructions && (
              <>
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Timer className="text-purple-400" /> 조리 방법</h2>
                <p className="text-gray-800 mb-4 whitespace-pre-line">{detail.instructions}</p>
              </>
            )}
          </div>
        </div>

        {/* 팁 */}
        {detail.tips && (
          <div className="mb-8" data-aos="fade-up">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><AlertTriangle className="text-red-400" /> 팁</h2>
            <p className="text-gray-800">{detail.tips}</p>
          </div>
        )}
      </Card>
    </Layout>
  );
}