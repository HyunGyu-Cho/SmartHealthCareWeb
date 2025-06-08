const navItems = [
  "홈으로", "인바디 입력", "체형분석보기", "추천운동보기", "추천식단보기", "평가하기", "커뮤니티"
];

export default function Navigation() {
  return (
    <nav className="flex gap-2">
      {navItems.map(item => (
        <button
          key={item}
          className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
        >
          {item}
        </button>
      ))}
    </nav>
  );
}