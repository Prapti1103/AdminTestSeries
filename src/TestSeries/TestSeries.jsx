import React from "react";

import CreateQuestion from "./CreateQuestion";
import CreateTestPaper from "./CreateTestPaper";
import CreateTestSeries from "./CreateTestSeries";
import AddQuestion from "./AddQuestion";
import SolvedTestPaper from "./SolvedTestPaper";
import TestSeriesSetting from "./TestSeriesSetting";

const TestSeries = ({ activeTab }) => {

  console.log("ACTIVE TAB:", activeTab);

  switch (activeTab) {

    case "dashboard":
      return (
        <div style={{ width: "100%" }}>
          <h2>Dashboard</h2>
        </div>
      );

    case "createTestSeries":
      return (
        <div style={{ width: "100%" }}>
          <CreateTestSeries />
        </div>
      );

    case "createTestPaper":
      return (
        <div style={{ width: "100%" }}>
          <CreateTestPaper />
        </div>
      );

    case "createQuestion":
      return (
        <div style={{ width: "100%" }}>
          <CreateQuestion />
        </div>
      );

    case "addQuestion":
      return (
        <div style={{ width: "100%" }}>
          <AddQuestion />
        </div>
      );

    case "solvedTestPaper":
      return (
        <div style={{ width: "100%" }}>
          <SolvedTestPaper />
        </div>
      );

    case "settings":
      return (
        <div style={{ width: "100%" }}>
          <TestSeriesSetting />
        </div>
      );

    default:
      return (
        <div style={{ width: "100%" }}>
          <CreateTestSeries />
        </div>
      );
  }
};

export default TestSeries;