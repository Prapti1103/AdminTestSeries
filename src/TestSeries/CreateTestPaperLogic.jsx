// CreateTestPaperLogic.jsx

import {
  getAllTestpapers,
  getAllVTCategories,
  getAllTestSeries,
  getTestPapersByTestSeries,
  getAllSections,
  updateTestPaper,
  createTestPaper,
  deleteTestPaper,
  getSolvedCount,
  getRanking,
  fetchQuestionByTestPaperId,
  updateShowTestResult,
} from "./TestSeriesAPI"; // Adjust path as needed

import { message, Modal } from "antd";

// Fetch test papers
export const fetchTestPapers = async (setTestPapers) => {
  try {
    const response = await getAllTestpapers();
    setTestPapers(response.data);
  } catch (error) {
    console.error("Error fetching test papers:", error);
  }
};

// Fetch test series
export const fetchTestSeries = async (setTestSeriesList) => {
  try {
    const response = await getAllTestSeries();
    setTestSeriesList(response.data);
  } catch (error) {
    console.error("Error fetching test series:", error);
  }
};

// Fetch sections
export const fetchSections = async (setSectionsList) => {
  try {
    const response = await getAllSections();
    setSectionsList(response.data);
  } catch (error) {
    console.error("Error fetching sections:", error);
  }
};

// Fetch categories
export const fetchCategories = async (setCategories, setLoading, message) => {
  try {
    setLoading(true);
    const response = await getAllVTCategories();
    setCategories(response.data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    message.error("Failed to fetch categories");
  } finally {
    setLoading(false);
  }
};

// Fetch test papers by series
export const fetchPapersBySeries = async (seriesId, setTestPapers) => {
  if (seriesId === "all") {
    await fetchTestPapers(setTestPapers);
  } else if (seriesId) {
    try {
      const res = await getTestPapersByTestSeries(seriesId);
      setTestPapers(res.data);
    } catch (error) {
      console.error("Error loading test papers by series:", error);
    }
  } else {
    setTestPapers([]);
  }
};

// Fetch questions for a test paper
export const fetchQuestions = async (
  testPaperId,
  setQuestions,
  setSelectedTestPaperId,
  setViewQuestions,
  setLoading
) => {
  setLoading(true);
  try {
    const response = await fetchQuestionByTestPaperId(testPaperId);
    setQuestions(response.data);
    setSelectedTestPaperId(testPaperId);
    setViewQuestions(true);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
  setLoading(false);
};

// Download PDF for a test paper view
export const handleDownloadViewPaper = (
  testPaper,
  questions,
  Swal,
  jsPDF,
  autoTable
) => {
  if (!testPaper) {
    Swal.fire("Error!", "No test paper selected.", "error");
    return;
  }
  if (!questions || questions.length === 0) {
    Swal.fire("Error!", "No questions available to download.", "error");
    return;
  }

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  let y = 30;
  let pageNumber = 1;

  // Helper functions for header, footer, watermark
  const addHeader = () => {
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 128);
    doc.text("PJSOFTTECH TEST SERIES", pageWidth / 2, 15, { align: "center" });
    doc.setDrawColor(0, 0, 128);
    doc.setLineWidth(1);
    doc.line(10, 20, pageWidth - 10, 20);
  };

  const addFooter = () => {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });
    doc.setLineWidth(0.5);
    doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
  };

  const addWatermark = () => {
    const fontSize = 80;
    const opacity = 0.1;
    const watermarkText = "PJSOFTTECH";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    doc.setTextColor(100, 100, 100);
    doc.setGState(new doc.GState({ opacity: opacity }));
    const x = pageWidth / 2;
    const y = pageHeight / 2;
    const angleOffset = 45;
    doc.text(watermarkText, x, y, { angle: angleOffset, align: "center" });
    doc.setGState(new doc.GState({ opacity: 1 }));
  };

  // Add header, watermark, footer
  addHeader();
  addWatermark();
  addFooter();

  // Test Paper info
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 128);
  doc.text(`${testPaper.testTitle || "N/A"}`, pageWidth / 2, 30, {
    align: "center",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const margin = 10;
  const detailsY = 40;
  const spacing = 5;

  const totalMarksText = `Total Marks: ${testPaper.totalMarks || "N/A"}`;
  const durationText = `Duration: ${testPaper.duration || "N/A"} mins`;
  const startDateText = `Start Date: ${testPaper.testStartDate || "N/A"}`;
  const endDateText = `End Date: ${testPaper.testEndDate || "N/A"}`;

  doc.text(totalMarksText, margin, detailsY);
  doc.text(
    durationText,
    margin + doc.getTextWidth(totalMarksText) + spacing,
    detailsY
  );
  doc.text(
    startDateText,
    margin + doc.getTextWidth(totalMarksText + durationText) + spacing * 2,
    detailsY
  );
  doc.text(
    endDateText,
    margin +
      doc.getTextWidth(totalMarksText + durationText + startDateText) +
      spacing * 3,
    detailsY
  );

  // Terms & Conditions
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 128);
  doc.text("TERMS & CONDITIONS", 10, y);
  y += 5;
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(10, y, pageWidth - 20, 20, 5, 5, "F");
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  let termsText = testPaper.terms || "N/A";
  let splitTerms = doc.splitTextToSize(termsText, pageWidth - 30);
  let termsHeight = splitTerms.length * 7;

  if (y + termsHeight > pageHeight - 20) {
    doc.addPage();
    pageNumber++;
    y = 30;
    addHeader();
    addWatermark();
    addFooter();
  }

  doc.setFillColor(240, 240, 240);
  doc.roundedRect(10, y, pageWidth - 20, termsHeight + 5, 5, 5, "F");
  doc.text(splitTerms, 15, y + 8);
  y += termsHeight + 15;

  // Questions
  const answerKey = [];
  questions.forEach((question, index) => {
    if (y + 30 > pageHeight - 20) {
      doc.addPage();
      pageNumber++;
      y = 30;
      addHeader();
      addWatermark();
      addFooter();
    }

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    doc.text(
      `${index + 1}. ${
        question.createQuestion || question.questionText || "N/A"
      }`,
      12,
      y + 8
    );
    y += 15;

    if (question.options) {
      for (
        let optIndex = 0;
        optIndex < question.options.length;
        optIndex += 2
      ) {
        if (y + 10 > pageHeight - 20) {
          doc.addPage();
          pageNumber++;
          y = 30;
          addHeader();
          addWatermark();
          addFooter();
        }
        doc.setFillColor(255);
        doc.roundedRect(15, y, pageWidth - 30, 8, 2, 2, "F");
        const firstOption = `${String.fromCharCode(65 + optIndex)}. ${
          question.options[optIndex] || ""
        }`;
        const secondOption = question.options[optIndex + 1]
          ? `${String.fromCharCode(65 + optIndex + 1)}. ${
              question.options[optIndex + 1]
            }`
          : "";
        const midX = pageWidth / 2;
        doc.text(firstOption, 20, y + 6);
        if (secondOption) {
          doc.text(secondOption, midX + 10, y + 6);
        }
        y += 12;
      }
    }
    y += 5;
    doc.setDrawColor(100);
    doc.setLineWidth(0.5);
    doc.line(10, y, pageWidth - 10, y);
    y += 8;

    // Store correct answer
    answerKey.push({
      index: index + 1,
      answer: question.correctanswer || "N/A",
    });
  });

  // Answer Key Section
  doc.addPage();
  pageNumber++;
  y = 30;
  addHeader();
  addWatermark();
  addFooter();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 128);
  doc.text("ANSWER KEY", pageWidth / 2, y, { align: "center" });
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0);

  answerKey.forEach((ans) => {
    if (y + 10 > pageHeight - 20) {
      doc.addPage();
      pageNumber++;
      y = 30;
      addHeader();
      addWatermark();
      addFooter();
    }
    doc.text(`${ans.index}. ${ans.answer}`, 12, y);
    y += 8;
  });

  // Save PDF
  doc.save("Styled_Test_Paper.pdf");
};

// Handle submit (create/update)
export const handleSubmitTestPaper = async (
  testPaper,
  isEditing,
  selectedTestPaper,
  fetchTestPapers,
  Swal,
  updateTestPaper,
  createTestPaper,
  resetForm
) => {
  if (!testPaper.testSeries.id) {
    Swal.fire("Error!", "Please select a valid test series.", "error");
    return;
  }

  // Combine date and time into ISO 8601 format
  const formattedStartTime = `${testPaper.testStartDate}T${testPaper.startTime}:00`;
  const formattedEndTime = `${testPaper.testEndDate}T${testPaper.endTime}:00`;

  const payload = {
    ...testPaper,
    startTime: formattedStartTime,
    endTime: formattedEndTime,
  };

  try {
    if (isEditing) {
      await updateTestPaper(selectedTestPaper.id, payload);
      Swal.fire("Success!", "Test Paper updated successfully!", "success");
    } else {
      await createTestPaper(payload);
      Swal.fire("Success!", "Test Paper created successfully!", "success");
    }
    await fetchTestPapers();
    resetForm();
  } catch (error) {
    Swal.fire(
      "Error!",
      `Error ${isEditing ? "updating" : "creating"} Test Paper.`,
      "error"
    );
  }
};

// Delete test paper
export const handleDeleteTestPaper = async (
  id,
  deleteTestPaper,
  setTestPapers,
  Swal
) => {
  if (!id) {
    Swal.fire("Error!", "Invalid Test Paper ID", "error");
    return;
  }
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteTestPaper(id);
        setTestPapers((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "Test paper has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete test paper.", "error");
      }
    }
  });
};

// getSolvedCount
export const fetchSolvedCount = async (testPaperId, setCount) => {
  try {
    const response = await getSolvedCount(testPaperId);
    const data = response.data;
    if (typeof data === "number") {
      setCount(data);
    } else {
      console.error("Invalid response data:", data);
    }
  } catch (error) {
    console.error("Error fetching solved count:", error);
  }
};

// getRanking data
export const fetchRankingData = async (
  testPaperId,
  setRankingData,
  setShowRanking,
  Swal,
  getRanking
) => {
  try {
    const response = await getRanking(testPaperId);
    setRankingData(response.data);
    setShowRanking(true);
  } catch (error) {
    console.error("Error fetching ranking data:", error);
    Swal.fire("Error!", "Failed to fetch ranking data.", "error");
  }
};

const handleShowResultToggle = (record) => {
  // Show confirmation modal
  Modal.confirm({
    title: `Are you sure you want to ${
      record.showTestResult ? "disable" : "enable"
    } test result visibility?`,
    onOk: () => {
      // Call API to update
      updateShowTestResult(record.id, !record.showTestResult)
        .then((response) => {
          const updatedValue = response.data.showTestResult;
          // Update local state accordingly
          setTestPapers((prev) =>
            prev.map((item) =>
              item.id === record.id
                ? { ...item, showTestResult: updatedValue }
                : item
            )
          );
          message.success(
            `Test result visibility has been ${
              updatedValue ? "ENABLED" : "DISABLED"
            } successfully.`
          );
        })
        .catch((err) => {
          console.error(err);
          message.error("Failed to update test result visibility.");
        });
    },
  });
};
