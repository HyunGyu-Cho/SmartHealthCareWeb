import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from '../components/Layout';

// 날짜별 운동 수행 여부를 localStorage에 저장 (API 연동 전 임시)
function getCheckedDates() {
  return JSON.parse(localStorage.getItem('workoutCheckedDates') || '{}');
}
function setCheckedDates(data) {
  localStorage.setItem('workoutCheckedDates', JSON.stringify(data));
}

function getInbodySurvey() {
  // inbody/survey를 localStorage에서 불러옴(없으면 null)
  try {
    return {
      inbody: JSON.parse(localStorage.getItem('inbody')),
      survey: localStorage.getItem('survey')
    };
  } catch {
    return { inbody: null, survey: null };
  }
}

export default function CalendarPage() {
  const [checked, setChecked] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workoutList, setWorkoutList] = useState([]);
  const [workoutCache, setWorkoutCache] = useState({}); // 요일별 캐시
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const selectedDateKey = selectedDate.toISOString().slice(0, 10);
  const dayNames = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];

  // 히스토리 fetch
  useEffect(() => {
    const userId = 1; // TODO: 실제 로그인 사용자 ID로 대체
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const from = `${year}-${String(month).padStart(2, '0')}-01`;
    const to = new Date(year, month, 0).toISOString().slice(0, 10);
    fetch(`/api/history?userId=${userId}&from=${from}&to=${to}`)
      .then(res => res.json())
      .then(data => {
        // { [date]: { workout: true/false, ... } } 형태로 가공
        const map = {};
        data.forEach(h => {
          if (!map[h.date]) map[h.date] = {};
          if (h.type === 'workout') map[h.date].workout = h.completed;
          if (h.type === 'diet') map[h.date].diet = h.completed;
        });
        setChecked(map);
      });
  }, [selectedDate]);

  // 날짜 클릭 시 해당 요일의 추천운동 fetch
  const handleDayClick = async (date) => {
    setSelectedDate(date);
    const dayOfWeek = dayNames[date.getDay()];
    if (workoutCache[dayOfWeek]) {
      setWorkoutList(workoutCache[dayOfWeek]);
      return;
    }
    setLoading(true);
    setError('');
    // inbody/survey 불러오기
    const { inbody, survey } = getInbodySurvey();
    if (!inbody || !survey) {
      setError('추천운동을 불러오려면 인바디/설문 입력이 필요합니다.');
      setWorkoutList([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/recommend-workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inbody, survey })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const workouts = data.workouts?.[dayOfWeek] || [];
      setWorkoutCache(prev => ({ ...prev, [dayOfWeek]: workouts }));
      setWorkoutList(workouts);
    } catch (e) {
      setError(e.message);
      setWorkoutList([]);
    } finally {
      setLoading(false);
    }
  };

  // 운동별 체크박스
  const handleWorkoutCheck = (dateKey, workoutName, value) => {
    setChecked(prev => ({
      ...prev,
      [dateKey]: {
        ...(prev[dateKey] || {}),
        [workoutName]: value
      }
    }));
  };

  // 커스텀 캘린더 타일 클래스
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const key = date.toISOString().slice(0, 10);
      const isToday = key === new Date().toISOString().slice(0, 10);
      const dayChecked = checked[key];
      if (dayChecked && Object.values(dayChecked).length > 0 && Object.values(dayChecked).every(Boolean)) {
        return 'bg-green-200 text-green-900 font-bold rounded-full border-2 border-green-400';
      }
      if (isToday) {
        return 'bg-blue-100 text-blue-700 font-bold rounded-full border-2 border-blue-400';
      }
    }
    return '';
  };

  // 완료율 계산
  const doneCount = workoutList.filter(w => checked[selectedDateKey]?.[w.name]).length;
  const totalCount = workoutList.length;

  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto mt-24 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-primary tracking-tight">운동기록 캘린더</h2>
        <p className="text-center text-gray-500 mb-8">날짜를 클릭해 운동 수행 여부를 체크하세요!</p>
        <div className="flex flex-col md:flex-row gap-10 items-start justify-center">
          <div className="flex-1 flex justify-center">
            <Calendar
              onClickDay={handleDayClick}
              value={selectedDate}
              onChange={setSelectedDate}
              tileClassName={tileClassName}
              calendarType="gregory"
              className="w-full border-0 shadow-lg rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-pink-50"
            />
          </div>
          <div className="flex-1">
            {loading && <div className="text-center mt-6 text-blue-500">운동 데이터를 불러오는 중...</div>}
            {error && <div className="text-center mt-6 text-red-500">{error}</div>}
            {workoutList.length > 0 && !loading && !error && (
              <div className="mt-2">
                <h3 className="text-xl font-bold mb-4 text-primary">{dayNames[selectedDate.getDay()]} 추천운동</h3>
                <div className="mb-2 text-gray-600">완료: {doneCount} / {totalCount} ({totalCount > 0 ? Math.round(doneCount/totalCount*100) : 0}%)</div>
                <ul className="space-y-4">
                  {workoutList.map(w => (
                    <li key={w.name} className={`flex items-center gap-3 bg-white rounded-xl p-4 shadow-md border transition ${checked[selectedDateKey]?.[w.name] ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}>
                      <input
                        type="checkbox"
                        checked={!!checked[selectedDateKey]?.[w.name]}
                        onChange={e => handleWorkoutCheck(selectedDateKey, w.name, e.target.checked)}
                        className="accent-green-500 w-5 h-5"
                      />
                      <span className="font-semibold text-lg">{w.name}</span>
                      <span className="ml-2 text-gray-500 text-sm">{w.description}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-center text-green-700 font-bold text-lg">
                  {doneCount === totalCount && totalCount > 0 && '오늘의 운동을 모두 완료했습니다!'}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-10 text-center">
          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold shadow">
            ✔ 표시: 해당 날짜의 모든 운동을 완료한 경우!
          </span>
        </div>
      </div>
    </Layout>
  );
} 