import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PasswordScreen from './components/PasswordScreen';
import InbodyInputPage from './pages/InbodyInputPage';
import BodyAnalysisPage from './pages/BodyAnalysisPage';
import RecommendedWorkoutListPage from './pages/RecommendedWorkoutListPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import RecommendedDietListPage from './pages/RecommendedDietListPage';
import DietDetailPage from './pages/DietDetailPage';
import EvaluationPage from './pages/EvaluationPage';
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';
import CalendarPage from './pages/CalendarPage';
import SurveyPage from './pages/SurveyPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/reset-password" element={<PasswordScreen />} />
                <Route path="/inbody" element={<InbodyInputPage />} />
                <Route path="/analysis" element={<BodyAnalysisPage />} />
                <Route path="/workouts" element={<RecommendedWorkoutListPage />} />
                <Route path="/workout/:id" element={<WorkoutDetailPage />} />
                <Route path="/diets" element={<RecommendedDietListPage />} />
                <Route path="/diet/:id" element={<DietDetailPage />} />
                <Route path="/evaluations" element={<EvaluationPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/survey" element={<SurveyPage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}