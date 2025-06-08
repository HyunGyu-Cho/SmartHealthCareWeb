// src/pages/SignupPage.jsx
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function SignupPage() {
  const navigate = useNavigate();
  const handleSubmit = e => {
    e.preventDefault();
    navigate('/login');
  };

  // 소셜 로그인 핸들러 (실제 인증 로직은 별도 구현 필요)
  const handleSocialLogin = provider => {
    alert(`${provider} 회원가입/로그인은 추후 구현 예정입니다.`);
  };

  return (
    <Layout>
      {/* Hero/Intro Section */}
      <section className="bg-gradient-to-tr from-blue-50 via-blue-100 to-pink-50 rounded-3xl p-8 mb-10 shadow-xl flex flex-col items-center">
        
        <h2 className="text-3xl font-bold text-primary mb-2">회원가입</h2>
        <p className="text-gray-700 text-center">Smart Healthcare의 다양한 서비스를 경험해보세요!</p>
      </section>

      {/* Form Section */}
      <section className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md mx-auto mb-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <InputField label="이메일" type="email" placeholder="이메일 입력" required />
          <InputField label="비밀번호" type="password" placeholder="비밀번호 입력" required />
          <InputField label="비밀번호 확인" type="password" placeholder="비밀번호 재입력" required />
          <Button type="submit">회원가입</Button>
        </form>
        <div className="flex flex-col gap-2 mt-6 w-full">
          <button type="button" onClick={() => handleSocialLogin('Google')} className="w-full py-2 rounded bg-white border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50">
            <img src="/assets/googleLogin.png" alt="구글" className="w-5 h-5" /> 구글로 회원가입/로그인
          </button>
          <button type="button" onClick={() => handleSocialLogin('Kakao')} className="w-full py-2 rounded bg-[#FEE500] text-black flex items-center justify-center gap-2 hover:bg-yellow-200">
            <img src="/assets/kakaoLogin.png" alt="카카오" className="w-5 h-5" /> 카카오로 회원가입/로그인
          </button>
          <button type="button" onClick={() => handleSocialLogin('Naver')} className="w-full py-2 rounded bg-[#03C75A] text-white flex items-center justify-center gap-2 hover:bg-green-600">
            <img src="/assets/naverLogin.png" alt="네이버" className="w-5 h-5" /> 네이버로 회원가입/로그인
          </button>
        </div>
      </section>

      {/* 안내/배너 Section */}
      <section className="flex flex-col items-center gap-4">
      
        <p className="text-lg text-center">회원이 되시면 맞춤형 건강관리, 커뮤니티 등 다양한 혜택을 누릴 수 있습니다.</p>
      </section>
    </Layout>
  );
}