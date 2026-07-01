import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import MainLayout from "./Layout/MainLayout";
import AdminLogin from "./TestSeries/AdminLogin";
import ProtectedRoute from "./routes/ProtectedRoute";
import TestPaperForm from "./TestSeries/TestPaperForm";
import QuestionsByTestPaperId from "./TestSeries/QuestionsByTestPaperId";
import RankingByTestPaperId from "./TestSeries/RankingByTestPaperId";
import UserSolvedTestPapers from "./TestSeries/UserSolvedTestPapers";

function AppContent() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/ebooklayout/test-series-manager/test-paper-form" element={<TestPaperForm />} />
        <Route path="/ebooklayout/test-series-manager/test-paper-form/:id" element={<TestPaperForm />} />
        <Route path="/ebooklayout/test-series-manager/test-paper-questions/:id" element={<QuestionsByTestPaperId />} />
        <Route path="/ebooklayout/test-series-manager/test-paper-ranking/:id" element={<RankingByTestPaperId />} />
        <Route path="/ebooklayout/test-series-manager/solved-paper/:id" element={<UserSolvedTestPapers />} />
        <Route path="*" element={<MainLayout />} />
      </Route>

      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;