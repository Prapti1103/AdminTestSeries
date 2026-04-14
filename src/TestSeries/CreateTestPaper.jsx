import { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Card,
  Form,
  Select,
  Table,
  Checkbox,
  Grid,
  Row,
  Col,
  List,
  Modal,
  Switch,
  Typography,
  Upload,
  message,
  Tag,
  Image,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  TrophyOutlined,
  CloudUploadOutlined,
  SearchOutlined,
  SyncOutlined,
  PlusOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import { Link, useNavigate } from "react-router-dom";
import autoTable from "jspdf-autotable";
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
  uploadTestPaperImage,
  updateTestPaperImage,
  updateShowTestResult,
  uploadAllResultPdf,
  updateShowAllResult,
  updateAllResultPdf,
  updateDownloadTestPaper,
} from "./TestSeriesAPI";
import AnswerSheetModal from "./AnswerSheetModal";

const { Option } = Select;
const { Text } = Typography;

function CreateTestPaper() {
  const [testPaper, setTestPaper] = useState({
    testTitle: "",
    status: true,
    noOfQuestions: "",
    totalMarks: "",
    duration: "",
    testStartDate: "",
    testEndDate: "",
    startTime: "",
    endTime: "",
    testSeries: { id: null },
    sections: [],
    multipleAttemptsAllowed: false,
    maxAttemptsAllowed: 1,
  });
  const navigate = useNavigate();
  const [testPapers, setTestPapers] = useState([]);
  const [testSeriesList, setTestSeriesList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [showRanking, setShowRanking] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredPapers, setFilteredPapers] = useState(testPapers || []);
  const [form] = Form.useForm();

  const [answerSheetVisible, setAnswerSheetVisible] = useState(false);
  const [selectedTestPaperForAnswers, setSelectedTestPaperForAnswers] =
    useState(null);
  const [answerSheetQuestions, setAnswerSheetQuestions] = useState([]);
  const [loadingAnswerSheet, setLoadingAnswerSheet] = useState(false);

  const [pageSize, setPageSize] = useState(1000);
  const [currentPage, setCurrentPage] = useState(1);

  const handleShowAnswerSheet = async (testPaper) => {
    setSelectedTestPaperForAnswers(testPaper);
    setLoadingAnswerSheet(true);
    setAnswerSheetVisible(true);

    try {
      // First try to use questions from the testPaper object (from getAllTestpapers API)
      if (testPaper.questions && testPaper.questions.length > 0) {
        setAnswerSheetQuestions(testPaper.questions);
        setLoadingAnswerSheet(false);
        return;
      }

      // If no questions in testPaper object, try fetching separately
      const response = await fetchQuestionByTestPaperId(testPaper.id);
      setAnswerSheetQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions for answer sheet:", error);
      message.error("Failed to load questions for answer sheet");
      setAnswerSheetQuestions([]);
    } finally {
      setLoadingAnswerSheet(false);
    }
  };

  // Handle Image Upload
  const handleImageUpload = async (file, paper) => {
    const formData = new FormData();
    formData.append("image", file);
    setUploadingId(paper.id);
    try {
      if (paper.image) {
        await updateTestPaperImage(paper.id, formData);
        message.success("Image updated successfully!");
      } else {
        await uploadTestPaperImage(paper.id, formData);
        message.success("Image uploaded successfully!");
      }
      fetchTestPapers();
    } catch (error) {
      message.error("Failed to upload/update image.");
    }
    setUploadingId(null);
    return false; // Prevent default upload behavior
  };

  // Handle Show Test Result toggle
  const handleShowResultToggle = (record) => {
    Swal.fire({
      title: `Are you sure you want to ${
        record.showTestResult ? "disable" : "enable"
      } show test result?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "small-swal-popup",
        title: "small-swal-title",
        confirmButton: "small-swal-confirm",
        cancelButton: "small-swal-cancel",
      },
      didOpen: () => {
        const style = document.createElement("style");
        style.innerHTML = `
        .small-swal-popup {
          width: 300px !important;
          font-size: 16px;
        }
        .small-swal-title {
          font-size: 20px !important;
        }
        .small-swal-confirm,
        .small-swal-cancel {
          font-size: 13px !important;
          padding: 4px 12px !important;
        }
      `;
        document.head.appendChild(style);
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await updateShowTestResult(
            record.id,
            !record.showTestResult
          );
          const updatedShowTestResult = response.data.showTestResult;

          setTestPapers((prev) =>
            prev.map((paper) =>
              paper.id === record.id
                ? { ...paper, showTestResult: updatedShowTestResult }
                : paper
            )
          );

          setFilteredPapers((prev) =>
            prev.map((paper) =>
              paper.id === record.id
                ? { ...paper, showTestResult: updatedShowTestResult }
                : paper
            )
          );

          message.success(
            `Show Test Result ${
              updatedShowTestResult ? "enabled" : "disabled"
            } successfully!`
          );
        } catch (error) {
          console.error("Error updating show test result:", error);
          message.error("Failed to update show test result setting.");
        }
      }
    });
  };

  const handleShowAllResultToggle = (record) => {
    Swal.fire({
      title: `Are you sure you want to ${
        record.showAllResult ? "disable" : "enable"
      } show all result?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "small-swal-popup",
        title: "small-swal-title",
        confirmButton: "small-swal-confirm",
        cancelButton: "small-swal-cancel",
      },
      didOpen: () => {
        const style = document.createElement("style");
        style.innerHTML = `
        .small-swal-popup {
          width: 300px !important;
          font-size: 16px;
        }
        .small-swal-title {
          font-size: 20px !important;
        }
        .small-swal-confirm,
        .small-swal-cancel {
          font-size: 13px !important;
          padding: 4px 12px !important;
        }
      `;
        document.head.appendChild(style);
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await updateShowAllResult(
            record.id,
            !record.showAllResult
          );
          const updatedShowAllResult = response.data.showAllResult;

          setTestPapers((prev) =>
            prev.map((paper) =>
              paper.id === record.id
                ? { ...paper, showAllResult: updatedShowAllResult }
                : paper
            )
          );

          setFilteredPapers((prev) =>
            prev.map((paper) =>
              paper.id === record.id
                ? { ...paper, showAllResult: updatedShowAllResult }
                : paper
            )
          );

          message.success(
            `Show All Result ${
              updatedShowAllResult ? "enabled" : "disabled"
            } successfully!`
          );
        } catch (error) {
          console.error("Error updating show all result:", error);
          message.error("Failed to update show all result setting.");
        }
      }
    });
  };

  const handleDownloadTestPaperToggle = (record) => {
    Swal.fire({
      title: `Are you sure you want to ${
        record.downloadTestPaper ? "disable" : "enable"
      } download test paper?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "small-swal-popup",
        title: "small-swal-title",
        confirmButton: "small-swal-confirm",
        cancelButton: "small-swal-cancel",
      },
      didOpen: () => {
        const style = document.createElement("style");
        style.innerHTML = `
        .small-swal-popup {
          width: 300px !important;
          font-size: 16px;
        }
        .small-swal-title {
          font-size: 20px !important;
        }
        .small-swal-confirm,
        .small-swal-cancel {
          font-size: 13px !important;
          padding: 4px 12px !important;
        }
      `;
        document.head.appendChild(style);
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await updateDownloadTestPaper(
            record.id,
            !record.downloadTestPaper
          );
          const updatedDownloadTestPaper = response.data.downloadTestPaper;

          // Optional: log the updated value
          console.log("Updated downloadTestPaper:", updatedDownloadTestPaper);

          // Update the state with the new value
          setTestPapers((prev) =>
            prev.map((paper) =>
              paper.id === record.id
                ? { ...paper, downloadTestPaper: updatedDownloadTestPaper }
                : paper
            )
          );
          setFilteredPapers((prev) =>
            prev.map((paper) =>
              paper.id === record.id
                ? { ...paper, downloadTestPaper: updatedDownloadTestPaper }
                : paper
            )
          );

          message.success(
            `Download Test Paper has been ${
              updatedDownloadTestPaper ? "enabled" : "disabled"
            } successfully!`
          );
        } catch (error) {
          console.error("Error updating download test paper:", error);
          message.error("Failed to update download test paper setting.");
        }
      }
    });
  };

  useEffect(() => {
    setFilteredPapers(testPapers);
  }, [testPapers]);

  useEffect(() => {
    fetchTestPapers();
    fetchTestSeries();
    fetchSections();
  }, []);

  const fetchTestPapers = async () => {
    try {
      const response = await getAllTestpapers();
      const data = Array.isArray(response.data) ? response.data : [];
      setTestPapers(data);
    } catch (error) {
      console.error("Error fetching test papers:", error);
      setTestPapers([]);
    }
  };

  const fetchTestSeries = async () => {
    try {
      const response = await getAllTestSeries();
      setTestSeriesList(response.data);
    } catch (error) {
      console.error("Error fetching test series:", error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await getAllSections();
      setSectionsList(response.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let papers = [];

        if (selectedSeriesId === "all") {
          const res = await getAllTestpapers();
          papers = res.data;
        } else if (selectedSeriesId) {
          const res = await getTestPapersByTestSeries(selectedSeriesId);
          papers = Array.isArray(res.data)
            ? res.data
            : res.data?.testPapers || [];
        }

        setTestPapers(papers);
        setFilteredPapers(papers);
      } catch (error) {
        console.error("Error fetching test papers:", error);
        setTestPapers([]);
        setFilteredPapers([]);
      }
    };

    fetchData();
  }, [selectedSeriesId]);

  const SolvedTestPaperCount = ({ testPaperId }) => {
    const [solvedCount, setSolvedCount] = useState(0);

    useEffect(() => {
      if (testPaperId) {
        getSolvedCount(testPaperId)
          .then((response) => {
            const data = response.data;
            if (typeof data === "number") {
              setSolvedCount(data);
            } else {
              console.error("Invalid response data:", data);
            }
          })
          .catch((error) =>
            console.error("Error fetching solved count:", error)
          );
      }
    }, [testPaperId]);

    return <Text>{solvedCount}</Text>;
  };

  const handleDelete = async (id) => {
    if (!id) {
      message.error("Invalid Test Paper ID");
      return;
    }

    Modal.confirm({
      title: "Are you sure?",
      content: "You won't be able to revert this!",
      okText: "Yes, delete it!",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteTestPaper(id);
          setTestPapers((prev) => prev.filter((item) => item.id !== id));
          message.success("Test paper has been deleted.");
        } catch (error) {
          message.error("Failed to delete test paper.");
        }
      },
    });
  };

  useEffect(() => {
    setFilteredPapers(testPapers);
  }, [testPapers]);

  const handleSearch = () => {
    const filtered = testPapers.filter((paper) =>
      paper.testTitle.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPapers(filtered);
  };

  const handleReset = () => {
    setSearchText("");
    setFilteredPapers(testPapers);
  };

  const handleDownload = () => {
    if (rankingData.length === 0) {
      message.error("No ranking data available to download.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Ranking Results", pageWidth / 2, 20, { align: "center" });

    const headers = [
      [
        "Rank",
        "Name",
        "Email",
        "Phone",
        "Total Marks",
        "Questions",
        "Score",
        "Correct",
        "Incorrect",
        "Unsolved",
        "Total Time",
      ],
    ];

    const data = rankingData.map((rank) => [
      rank.rank,
      rank.userName,
      rank.email,
      rank.phoneNo,
      rank.totalMarks,
      rank.noOfQuestions,
      rank.totalScore,
      rank.correctQuestions,
      rank.incorrectQuestions,
      rank.unsolvedQuestions,
      rank.totalTime,
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontSize: 12,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 30 },
    });

    doc.save("Ranking_Results.pdf");
  };

  const handleAllResultPdfUpload = async (file, record) => {
    const testPaperId = record.id;
    try {
      if (record.allResultPdf) {
        await updateAllResultPdf(testPaperId, file);
        message.success("PDF updated successfully!");
      } else {
        await uploadAllResultPdf(testPaperId, file);
        message.success("PDF uploaded successfully!");
      }
      fetchTestPapers(); // Refresh table data
    } catch (error) {
      console.error("Error uploading PDF:", error);
      message.error("Failed to upload or update PDF.");
    }
    return false; // Prevent auto upload behavior
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "serial",
      key: "serial",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "testTitle",
      key: "testTitle",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() =>
            navigate(
              `/ebooklayout/test-series-manager/test-paper-form/${record.id}`
            )
          }
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Img",
      dataIndex: "image",
      key: "image",
      render: (image, record) =>
        image ? (
          <Image
            width={40}
            height={40}
            src={image}
            alt="Test Paper"
            style={{ cursor: "pointer" }}
            preview={{
              mask: null,
            }}
          />
        ) : (
          <Text type="secondary">No Image</Text>
        ),
    },
    {
      title: "Attem",
      dataIndex: "multipleAttemptsAllowed",
      key: "multipleAttemptsAllowed",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Max Attem",
      dataIndex: "maxAttemptsAllowed",
      key: "maxAttemptsAllowed",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Result",
      title: "Result",
      dataIndex: "showTestResult",
      key: "showTestResult",
      render: (showTestResult, record) => (
        <Switch
          checked={showTestResult || false}
          onChange={() => handleShowResultToggle(record)}
          style={{
            backgroundColor: showTestResult ? "#52c41a" : "#ff4d4f",
          }}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      ),
    },
    {
      title: "Noq",
      dataIndex: "noOfQuestions",
      key: "noOfQuestions",
    },
    {
      title: "Marks",
      dataIndex: "totalMarks",
      key: "totalMarks",
    },
    {
      title: "Dur.",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Start Date",
      dataIndex: "testStartDate",
      key: "testStartDate",
    },
    {
      title: "End Date",
      dataIndex: "testEndDate",
      key: "testEndDate",
    },
    {
      title: "Solved",
      key: "solved",
      render: (_, record) => <SolvedTestPaperCount testPaperId={record.id} />,
    },
    {
      title: "All Result",
      dataIndex: "showAllResult",
      key: "showAllResult",
      render: (showAllResult, record) => (
        <Switch
          checked={showAllResult || false}
          onChange={() => handleShowAllResultToggle(record)}
          style={{
            backgroundColor: showAllResult ? "#52c41a" : "#ff4d4f",
          }}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      ),
    },
    // {
    //   title: "Rank PDF",
    //   dataIndex: "allResultPdf",
    //   key: "allResultPdf",
    //   render: (pdfUrl) =>
    //     pdfUrl ? (
    //       <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
    //         View PDF
    //       </a>
    //     ) : (
    //       <Text type="secondary">No PDF</Text>
    //     ),
    // },
    {
      title: "Download",
      dataIndex: "downloadTestPaper",
      key: "downloadTestPaper",
      render: (downloadTestPaper, record) => (
        <Switch
          checked={downloadTestPaper || false}
          onChange={() => handleDownloadTestPaperToggle(record)}
          style={{
            backgroundColor: downloadTestPaper ? "#52c41a" : "#ff4d4f",
          }}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Tooltip title="View Questions">
            <Button
              icon={<EyeOutlined />}
              style={{ fontSize: "18px", color: "#1890ff" }}
              onClick={() =>
                navigate(
                  `/ebooklayout/test-series-manager/test-paper-questions/${record.id}`
                )
              }
            />
          </Tooltip>

          <Tooltip title="View Ranking">
            <Button
              icon={<TrophyOutlined />}
              style={{ fontSize: "18px", color: "gray" }}
              onClick={() =>
                navigate(
                  `/ebooklayout/test-series-manager/test-paper-ranking/${record.id}`
                )
              }
            />
          </Tooltip>

          {/* NEW: Answer Sheet Button */}
          <Tooltip title="View Answer Sheet">
            <Button
              icon={<FileTextOutlined />}
              style={{ fontSize: "18px", color: "#52c41a" }}
              onClick={() => handleShowAnswerSheet(record)}
            />
          </Tooltip>

          <Tooltip title={record.image ? "Update Image" : "Upload Image"}>
            <Upload
              showUploadList={false}
              beforeUpload={(file) => handleImageUpload(file, record)}
              disabled={uploadingId === record.id}
            >
              <Button
                icon={<CloudUploadOutlined />}
                style={{ fontSize: "18px" }}
                loading={uploadingId === record.id}
              />
            </Upload>
          </Tooltip>

          <Tooltip title="Delete Test Paper">
            <Button
              icon={<DeleteOutlined />}
              style={{ fontSize: "18px" }}
              danger
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Select
            placeholder="Select Series"
            value={selectedSeriesId}
            onChange={setSelectedSeriesId}
            style={{ width: 250 }}
          >
            <Option value="" disabled>
              Select Series
            </Option>
            <Option value="all">All</Option>
            {testSeriesList.map((series) => (
              <Option key={series.id} value={series.id}>
                {series.examTitle}
              </Option>
            ))}
          </Select>
        </Col>

        <Col>
          <Input
            placeholder="Search by Test Title"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            suffix={<SearchOutlined />}
            style={{ width: 250 }}
          />
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Col>

        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              navigate("/ebooklayout/test-series-manager/test-paper-form")
            }
          >
            Create Paper
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={[...filteredPapers].reverse()}
        columns={columns}
        rowKey="id"
        size="small"
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page) => setCurrentPage(page),
        }}
        locale={{
          emptyText: "No data available",
        }}
      />

      <div style={{ textAlign: "left", marginBottom: 10 }}>
        <span style={{ fontSize: "13px", color: "#666", marginRight: 8 }}>
          Rows per page:
        </span>
        <Select
          value={pageSize}
          onChange={(value) => {
            setPageSize(value);
            setCurrentPage(1);
          }}
          style={{ width: 80 }}
        >
          <Select.Option value={1000}>1000</Select.Option>
          <Select.Option value={5000}>5000</Select.Option>
          <Select.Option value={10000}>10000</Select.Option>
        </Select>
      </div>

      <AnswerSheetModal
        visible={answerSheetVisible}
        onCancel={() => {
          setAnswerSheetVisible(false);
          setSelectedTestPaperForAnswers(null);
          setAnswerSheetQuestions([]);
        }}
        testPaper={selectedTestPaperForAnswers}
        questions={answerSheetQuestions}
        loading={loadingAnswerSheet}
      />
    </div>
  );
}

export default CreateTestPaper;
