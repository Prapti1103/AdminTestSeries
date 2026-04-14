import React from "react";

import CreateQuestion from "./CreateQuestion";
import CreateTestPaper from "./CreateTestPaper";
import CreateTestSeries from "./CreateTestSeries";
import AddQuestion from "./AddQuestion";
import SolvedTestPaper from "./SolvedTestPaper";
import TestSeriesSetting from "./TestSeriesSetting"; 

const TestSeries = ({ activeTab }) => {
  return (
    <div style={{ width: "100%" }}>

      {activeTab === "createTestSeries" && <CreateTestSeries />}

      {activeTab === "createTestPaper" && <CreateTestPaper />}

      {activeTab === "createQuestion" && <CreateQuestion />}

      {activeTab === "addQuestion" && <AddQuestion />}

      {activeTab === "solvedTestPaper" && <SolvedTestPaper />}

      
      {activeTab === "settings" && <TestSeriesSetting />}

    </div>
  );
};

export default TestSeries;
