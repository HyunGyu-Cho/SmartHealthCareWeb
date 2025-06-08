import { Link } from 'react-router-dom';

export default function Header() {
  const navItems = [
    { name: '홈', to: '/' },
    { name: '소개', to: '/about' },
    { name: '인바디 입력', to: '/inbody' },
    { name: '체형분석', to: '/analysis' },
    { name: '추천운동', to: '/workouts' },
    { name: '추천식단', to: '/diets' },
    { name: '운동기록', to: '/calendar' },
    { name: '평가하기', to: '/evaluations' },
    { name: '커뮤니티', to: '/community' },
  ];

  return (
    <header className="bg-primary text-white shadow fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-bold">Smart Healthcare</Link>
        <nav className="hidden md:flex space-x-6">
          {navItems.map(item => (
            <Link key={item.to} to={item.to} className="hover:text-secondary">
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex gap-2">
          <Link to="/login" className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700">로그인</Link>
          <Link to="/signup" className="bg-white text-primary px-4 py-2 rounded border border-primary hover:bg-primary hover:text-white transition">회원가입</Link>
        </div>
      </div>
    </header>
  );
}