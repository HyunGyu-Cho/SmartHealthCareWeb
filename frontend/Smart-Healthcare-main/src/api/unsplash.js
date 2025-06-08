// Unsplash 이미지 검색 유틸리티
// 사용법: fetchUnsplashImage('운동명 또는 식단명')

const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';

export async function fetchUnsplashImage(query) {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=squarish&per_page=1`
  );
  const data = await res.json();
  return data.results?.[0]?.urls?.regular || null;
} 