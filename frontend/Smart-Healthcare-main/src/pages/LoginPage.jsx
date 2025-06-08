// src/pages/LoginPage.jsx
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import InputField from '../components/InputField';
import Footer from '../components/Footer';
import Button from '../components/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const handleSubmit = e => {
    e.preventDefault();
    navigate('/analysis');
  };

  // 소셜 로그인 핸들러 (실제 인증 로직은 별도 구현 필요)
  const handleSocialLogin = provider => {
    alert(`${provider} 로그인은 추후 구현 예정입니다.`);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
          <InputField label="이메일" type="email" placeholder="이메일 입력" required />
          <InputField label="비밀번호" type="password" placeholder="비밀번호 입력" required />
          <Button type="submit">로그인</Button>
          <div className="flex flex-col gap-2 mt-4">
            <button type="button" onClick={() => handleSocialLogin('Google')} className="w-full py-2 rounded bg-white border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50">
              <img src="/assets/googleLogin.png" alt="구글" className="w-5 h-5" /> 구글로 로그인
            </button>
            <button type="button" onClick={() => handleSocialLogin('Kakao')} className="w-full py-2 rounded bg-[#FEE500] text-black flex items-center justify-center gap-2 hover:bg-yellow-200">
              <img src="/assets/kakaoLogin.png" alt="카카오" className="w-5 h-5" /> 카카오로 로그인
            </button>
            <button type="button" onClick={() => handleSocialLogin('Naver')} className="w-full py-2 rounded bg-[#03C75A] text-white flex items-center justify-center gap-2 hover:bg-green-600">
              <img src="/assets/naverLogin.png" alt="네이버" className="w-5 h-5" /> 네이버로 로그인
            </button>
          </div>
          <div className="flex justify-between mt-6 text-sm">
            <Link to="/find-account" className="text-blue-600 hover:underline">아이디/비밀번호 찾기</Link>
            <Link to="/signup" className="text-blue-600 hover:underline">회원가입하기</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
