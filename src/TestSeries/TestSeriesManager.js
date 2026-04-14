import React from "react";
import { Routes, Route } from "react-router-dom";
import TestSeriesManagerLayout from "./TestSeriesManagerLayout";
import TestSeries from "./TestSeries";
import TestSeriesSetting from "./TestSeriesSetting";
import CreateTestSeries from "./CreateTestSeries";
import CreateTestPaper from "./CreateTestPaper";
import CreateQuestion from "./CreateQuestion";
import AddQuestion from "./AddQuestion";
import SolvedTestPaper from "./SolvedTestPaper";
import UserSolvedTestPapers from "./UserSolvedTestPapers";
import TestSeriesOrderList from "./TestSeriesOrderList";
import TestSeriesDashboard from "./TestSeriesDashboard";

export default function TestSeriesManager() {
  return (
    <TestSeriesManagerLayout>
      <Routes>
        <Route index element={<TestSeriesDashboard/>}/>
        <Route path="create-test-series" element={<CreateTestSeries />} />
        <Route path="test-paper" element={<CreateTestPaper/>}/>
        <Route path="test-question-paper" element={<CreateQuestion/>}/>
        <Route path='test-series-setting' element={<TestSeriesSetting/>}/>
        <Route path="test-add-question" element={<AddQuestion/>}/>
        <Route path="solved-paper" element={<SolvedTestPaper/>}/>
        <Route path="order-list" element={<TestSeriesOrderList/>}/>
      </Routes>
    </TestSeriesManagerLayout>
  );
}
