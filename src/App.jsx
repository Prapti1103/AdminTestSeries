import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import TestPaperForm from "./TestSeries/TestPaperForm";
import QuestionsByTestPaperId from "./TestSeries/QuestionsByTestPaperId";
import RankingByTestPaperId from "./TestSeries/RankingByTestPaperId";
import UserSolvedTestPapers from "./TestSeries/UserSolvedTestPapers";

function AppContent() {
  const location = useLocation();
  const isSpecialRoute = location.pathname.includes('/ebooklayout/test-series-manager/');

  if (isSpecialRoute) {
    return (
      <Routes>
        <Route path="/ebooklayout/test-series-manager/test-paper-form" element={<TestPaperForm />} />
        <Route path="/ebooklayout/test-series-manager/test-paper-form/:id" element={<TestPaperForm />} />
        <Route path="/ebooklayout/test-series-manager/test-paper-questions/:id" element={<QuestionsByTestPaperId />} />
        <Route path="/ebooklayout/test-series-manager/test-paper-ranking/:id" element={<RankingByTestPaperId />} />
        <Route path="/ebooklayout/test-series-manager/solved-paper/:id" element={<UserSolvedTestPapers />} />
      </Routes>
    );
  }

  return <MainLayout />;
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;