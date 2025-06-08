// src/pages/CommunityPage.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import HeroWithBg from '../components/HeroWithBg';
import SectionWithWave from '../components/SectionWithWave';

export default function CommunityPage() {
  // 탭 상태: 'community' 또는 'notice'
  const [tab, setTab] = useState('community');
  // 게시글 데이터 (실제론 백엔드에서 fetch)
  const [posts, setPosts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 커뮤니티 CRUD API 연동
  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch('/api/community');
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    if (tab === 'community') {
      fetchPosts();
      setTotalPages(1); // 실제 구현 시 페이지네이션 적용
    } else {
      // 공지사항 더미 데이터
      const dummyNotices = Array.from({ length: 5 }, (_, i) => ({
        id: 5 - i,
        title: `공지사항 ${5 - i}`,
        date: '2024-07-01',
        content: `이것은 공지사항 ${5 - i}의 내용입니다.`
      }));
      setNotices(dummyNotices);
      setTotalPages(1);
    }
    setSelectedPost(null);
    setShowForm(false);
    setEditingId(null);
    setFormTitle('');
    setFormContent('');
  }, [tab, page, search]);

  // 글 작성/수정
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;
    setLoading(true);
    if (editingId) {
      await fetch(`/api/community/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle, content: formContent }),
      });
    } else {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle, content: formContent }),
      });
    }
    setShowForm(false);
    setEditingId(null);
    setFormTitle('');
    setFormContent('');
    await fetchPosts();
    setLoading(false);
  };

  // 글 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setLoading(true);
    await fetch(`/api/community/${id}`, { method: 'DELETE' });
    await fetchPosts();
    setLoading(false);
  };

  // 글 수정 시작
  const handleEdit = (post) => {
    setShowForm(true);
    setEditingId(post.id);
    setFormTitle(post.title);
    setFormContent(post.content);
  };

  // 글쓰기 버튼
  const handleWrite = () => {
    setShowForm(true);
    setEditingId(null);
    setFormTitle('');
    setFormContent('');
  };

  // 현재 보여줄 데이터
  const data = tab === 'community' ? posts : notices;

  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto mt-24 p-8 bg-white rounded-2xl shadow-lg">
        <HeroWithBg
          title="커뮤니티"
          subtitle={"회원들이 남긴 경험과 팁을\n함께 공유하는 공간입니다."}
          bgImage="/assets/community-bg.jpg"
        />
        <SectionWithWave bgColor="bg-white">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-gray-600 text-lg">
              운동 후기, 레시피 팁, 궁금증 Q&A 등<br />
              자유롭게 글을 남겨보세요.
            </p>
          </div>
        </SectionWithWave>
        <div className="max-w-4xl mx-auto py-12 px-4">
          {/* 상단 탭 */}
          <div className="flex gap-4 border-b mb-6 bg-white rounded-t-2xl shadow">
            <Button
              className={`rounded-b-none border-b-2 px-6 py-2 font-bold text-lg
                ${tab === 'community'
                  ? 'border-primary text-primary bg-white shadow'
                  : 'border-transparent text-gray-400 bg-gray-100'}`}
              onClick={() => setTab('community')}
            >
              커뮤니티
            </Button>
            <Button
              className={`rounded-b-none border-b-2 px-6 py-2 font-bold text-lg
                ${tab === 'notice'
                  ? 'border-primary text-primary bg-white shadow'
                  : 'border-transparent text-gray-400 bg-gray-100'}`}
              onClick={() => setTab('notice')}
            >
              공지사항
            </Button>
          </div>
          {/* 검색창 */}
          <div className="flex justify-end mb-4" data-aos="fade-up">
            <InputField
              label=""
              type="text"
              placeholder="검색어를 입력하세요"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
          {/* 글쓰기 버튼 (커뮤니티 탭에서만) */}
          {tab === 'community' && !showForm && (
            <div className="flex justify-end mb-4">
              <Button className="bg-success text-white" onClick={handleWrite}>글쓰기</Button>
            </div>
          )}
          {/* 글 작성/수정 폼 */}
          {showForm && tab === 'community' && (
            <Card className="w-full max-w-2xl mx-auto mb-8">
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <InputField
                  label="제목"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  disabled={loading}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-gray-800 font-semibold text-base mb-1 tracking-wide">내용</label>
                  <textarea
                    className="px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition duration-200 hover:border-primary focus:border-primary min-h-[200px] text-base"
                    value={formContent}
                    onChange={e => setFormContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                    disabled={loading}
                    rows={8}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-primary text-white" disabled={loading}>
                    {editingId ? '수정' : '작성'}
                  </Button>
                  <Button type="button" className="bg-gray-300 text-gray-700" onClick={() => { setShowForm(false); setEditingId(null); }}>
                    취소
                  </Button>
                </div>
              </form>
            </Card>
          )}
          {/* 게시글 리스트 */}
          <Card className="w-full mb-8 p-0 overflow-x-auto" >
            <table className="w-full text-left border-t">
              <thead>
                <tr>
                  <th className="py-2 w-16">번호</th>
                  <th className="py-2">제목</th>
                  <th className="py-2 w-32">작성일</th>
                  {tab === 'community' && <th className="py-2 w-32">관리</th>}
                </tr>
              </thead>
              <tbody>
                {data.map(post => (
                  <tr key={post.id} className="border-b hover:bg-primary/5 cursor-pointer transition">
                    <td className="py-2" onClick={() => setSelectedPost(post)}>{post.id}</td>
                    <td className="py-2 text-blue-600 hover:underline" onClick={() => setSelectedPost(post)}>{post.title}</td>
                    <td className="py-2" onClick={() => setSelectedPost(post)}>{post.date}</td>
                    {tab === 'community' && (
                      <td className="py-2 flex gap-2">
                        <Button className="bg-info text-white px-3 py-1" onClick={() => handleEdit(post)}>수정</Button>
                        <Button className="bg-error text-white px-3 py-1" onClick={() => handleDelete(post.id)}>삭제</Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          {/* 게시글 내용 보기 */}
          {selectedPost && (
            <Card className="mt-8 w-full max-w-2xl mx-auto" >
              <div className="font-bold text-lg mb-2 text-primary font-display tracking-tight">{selectedPost.title}</div>
              <div className="text-gray-500 text-sm mb-4">{selectedPost.date}</div>
              <div className="text-gray-800 whitespace-pre-line mb-4 leading-relaxed">{selectedPost.content}</div>
              <Button className="w-full" onClick={() => setSelectedPost(null)}>
                목록으로 돌아가기
              </Button>
            </Card>
          )}
          {/* 페이지네이션 */}
          <div className="flex justify-center mt-6 gap-2" data-aos="fade-up">
            <Button
              className="px-3 py-1 border rounded disabled:opacity-50 min-w-[60px]"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              이전
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                className={`px-3 py-1 border rounded min-w-[40px] ${page === i + 1 ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              className="px-3 py-1 border rounded disabled:opacity-50 min-w-[60px]"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}