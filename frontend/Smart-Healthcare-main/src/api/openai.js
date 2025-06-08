// src/api/openai.js

const BASE_URL = '/api';

export async function fetchFeatureList() {
  const res = await fetch(`${BASE_URL}/feature-list`);
  if (!res.ok) throw new Error(`피처 리스트 조회 실패 (${res.status})`);
  return await res.json();
}

export async function postClassifyBody(inbody) {
  const res = await fetch(`${BASE_URL}/classify-body`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inbody),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `분류 실패 (${res.status})`);
  return data;  // { bodyType: '...' }
}

export async function fetchSurveyAnalysis(survey, inbody) {
  // 새로운 분리 엔드포인트 호출
  const [workoutsRes, dietsRes] = await Promise.all([
    fetch(`${BASE_URL}/recommend-workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inbody, survey }),
    }),
    fetch(`${BASE_URL}/recommend-diets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inbody, survey }),
    }),
  ]);

  const workoutsData = await workoutsRes.json();
  const dietsData = await dietsRes.json();

  if (!workoutsRes.ok) throw new Error(workoutsData.error || `운동 추천 실패 (${workoutsRes.status})`);
  if (!dietsRes.ok) throw new Error(dietsData.error || `식단 추천 실패 (${dietsRes.status})`);

  // 두 응답을 합쳐서 반환
  return {
    bodyType: workoutsData.bodyType,
    summary: workoutsData.summary,
    workouts: workoutsData.workouts,
    diets: dietsData.diets,
  };
}
