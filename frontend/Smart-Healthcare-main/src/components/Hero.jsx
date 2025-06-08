import React from 'react';

export default function Hero({ scrollToRef }) {
  const handleScroll = () => {
    if (scrollToRef && scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center"
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* 배경 동영상 */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/assets/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* 검정 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* 콘텐츠 */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 pt-20 md:pt-24">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          SMART HEALTHCARE
        </h1>
        <p className="text-lg md:text-2xl text-white/80 max-w-2xl">
          인바디 기반 AI 체형 분석과 맞춤 운동·식단 추천
        </p>
      
      </div>
    </section>
  );
}