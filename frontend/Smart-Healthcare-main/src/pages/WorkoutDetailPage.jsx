import Layout from '../components/Layout';
import BackButton from '../components/BackButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { fetchUnsplashImage } from '../api/unsplash';
import { Dumbbell, Flame, Timer, Target, Info, AlertTriangle } from 'lucide-react';

export default function WorkoutDetailPage() {
  const { workout } = useLocation().state || {};
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    if (workout) {
      setDetail(workout);
      fetchUnsplashImage(workout.name).then(url => setImageUrl(url || workout.imageUrl));
      setLoading(false);
    } else {
      setError('운동 정보를 불러올 수 없습니다.');
      setLoading(false);
    }
  }, [workout]);

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
        <div className="text-center py-16">{error || '운동 정보를 찾을 수 없습니다.'}</div>
      </Layout>
    );
  }

  // 운동 부위, 난이도, 태그 등 예시 데이터 추출
  const tags = detail?.tags || [detail?.part, detail?.difficulty].filter(Boolean);

  return (
    <Layout>
      <button onClick={() => navigate(-1)} className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow">← 뒤로가기</button>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white text-gray-800 shadow-lg rounded-2xl p-8">
          {/* 대표 이미지 + 운동명 + 태그/뱃지 */}
          <div className="mb-8 flex flex-col md:flex-row items-center gap-8" data-aos="fade-up">
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
                  <span className="font-bold text-lg">{detail.calories || '-'} kcal</span>
                </div>
                <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-2 shadow">
                  <Timer className="text-blue-400 mb-1" />
                  <span className="text-xs text-gray-500">시간</span>
                  <span className="font-bold text-lg">{detail.duration || '-'}분</span>
                </div>
                <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-2 shadow">
                  <Target className="text-green-400 mb-1" />
                  <span className="text-xs text-gray-500">난이도</span>
                  <span className="font-bold text-lg">{detail.difficulty || '-'}</span>
                </div>
                <div className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-2 shadow">
                  <Dumbbell className="text-purple-400 mb-1" />
                  <span className="text-xs text-gray-500">부위</span>
                  <span className="font-bold text-lg">{detail.part || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 운동 설명 (단계별) + 예시 영상 + 이유 */}
          <div className="mb-10 grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Info className="text-blue-400" /> 운동 방법</h2>
              {Array.isArray(detail.steps) ? (
                <ol className="list-decimal ml-6 text-gray-800 space-y-2">
                  {detail.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-800 mb-4">{detail.description}</p>
              )}
              {detail.reason && (
                <>
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Flame className="text-orange-400" /> 추천 이유</h2>
                  <p className="text-green-800 mb-4">{detail.reason}</p>
                </>
              )}
              {detail.infoUrl && (
                <a
                  href={detail.infoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 bg-blue-500 text-white px-4 py-2 rounded-full font-bold shadow hover:bg-blue-600 transition"
                >
                  운동 소개 보러가기
                </a>
              )}
            </div>
            {/* 효과 */}
            {detail.effects?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Flame className="text-orange-400" /> 효과</h2>
                <div className="grid grid-cols-1 gap-4">
                  {detail.effects.map((eff, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-4 shadow flex gap-4 items-center"
                    >
                      {eff.img && (
                        <img
                          src={eff.img}
                          alt={eff.title}
                          className="w-20 h-20 object-cover rounded-xl border"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold mb-1">{eff.title}</h3>
                        <p className="text-sm text-gray-600">{eff.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 팁/주의사항 */}
          {(detail.tips || detail.caution) && (
            <div className="mb-10" data-aos="fade-up">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><AlertTriangle className="text-red-400" /> 팁 & 주의사항</h2>
              {detail.tips && <p className="text-gray-800 mb-2">{detail.tips}</p>}
              {detail.caution && <p className="text-red-500 font-semibold">{detail.caution}</p>}
              {detail.cautionImg && (
                <img
                  src={detail.cautionImg}
                  alt="주의사항"
                  className="w-full max-w-md rounded-2xl mt-4"
                  data-aos="fade-up"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}