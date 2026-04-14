// Converted to Ant Design, logic unchanged
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Typography,
  Button,
  Checkbox,
  Select,
  List,
  message,
  Space,
  Card,
} from "antd";
import {
  getAllCategories,
  getAllSections,
  getQuestionCount,
  getTestPaperQuestions,
  removeQuestionsFromTestPaper,
  addQuestionsToTestPaper,
} from "./TestSeriesAPI";

const { Option } = Select;
const API_URL = "http://localhost:8080";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      sessionStorage.removeItem("token");
      window.location.href = "/admin";
    }
    return Promise.reject(error);
  }
);

const AddQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [testSeries, setTestSeries] = useState([]);
  const [testPapers, setTestPapers] = useState([]);
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTestSeries, setSelectedTestSeries] = useState("");
  const [selectedTestPaper, setSelectedTestPaper] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedRemoveQuestions, setSelectedRemoveQuestions] = useState([]);
  const [testPaperQuestions, setTestPaperQuestions] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [sectionQuestionCount, setSectionQuestionCount] = useState(null);

  useEffect(() => {
    fetchTestSeries();
    fetchSections();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedTestSeries) fetchTestPapers(selectedTestSeries);
  }, [selectedTestSeries]);

  useEffect(() => {
    if (selectedTestPaper) {
      fetchTestPaperQuestions(selectedTestPaper);
      fetchQuestionCount(selectedTestPaper);
    }
  }, [selectedTestPaper]);

  useEffect(() => {
    if (selectedSection) {
      fetchQuestions(selectedSection);
      fetchSectionQuestionCount(selectedSection);
    }
  }, [selectedSection]);

  const fetchTestSeries = async () => {
    try {
      const response = await api.get("/AllTestSeriesNames");
      setTestSeries(response.data);
    } catch (error) {
      console.error("Test series error:", error);
    }
  };

  const fetchTestPapers = async (id) => {
    try {
      const response = await api.get(`/TestPapersByTestSeries/${id}`);
      setTestPapers(response.data);
    } catch (error) {
      console.error("Test papers error:", error);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await getAllSections();
      setSections(res.data);
    } catch (e) {
      console.error("Sections error:", e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch (e) {
      console.error("Categories error:", e);
    }
  };

  const fetchQuestions = async (section) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await api.get(
        `/QuestionsBySections?sectionNames=${section}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions(res.data[section] || []);
    } catch (e) {
      console.error("Questions error:", e);
    }
  };

  const fetchTestPaperQuestions = async (id) => {
    try {
      const res = await getTestPaperQuestions(id);
      setTestPaperQuestions(res.data);
    } catch (e) {
      console.error("TP Questions error:", e);
    }
  };

  const fetchQuestionCount = async (id) => {
    try {
      const res = await getQuestionCount(id);
      setQuestionCount(res.data);
    } catch (e) {
      console.error("Count error:", e);
    }
  };

  const fetchSectionQuestionCount = async (section) => {
    try {
      const res = await api.get(`/questioncountbysection?section=${section}`);
      setSectionQuestionCount(res.data.count);
    } catch (e) {
      console.error("Section count error:", e);
    }
  };

  const handleQuestionSelect = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleRemoveSelect = (id) => {
    setSelectedRemoveQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleAddQuestionsToTestPaper = async () => {
    if (!selectedTestPaper || selectedQuestions.length === 0)
      return alert("Select test paper & questions.");
    try {
      await addQuestionsToTestPaper(selectedTestPaper, selectedQuestions);
      message.success("Questions added successfully.");
      fetchTestPaperQuestions(selectedTestPaper);
      fetchQuestionCount(selectedTestPaper);
      setSelectedQuestions([]);
    } catch (e) {
      console.error("Add error:", e);
      message.error("Failed to add questions.");
    }
  };

  const handleRemoveQuestions = async () => {
    if (!selectedTestPaper || selectedRemoveQuestions.length === 0)
      return alert("Select paper and questions.");
    try {
      await removeQuestionsFromTestPaper(
        selectedTestPaper,
        selectedRemoveQuestions
      );
      message.success("Removed successfully.");
      setSelectedRemoveQuestions([]);
      fetchTestPaperQuestions(selectedTestPaper);
      fetchQuestionCount(selectedTestPaper);
    } catch (e) {
      console.error("Remove error:", e);
      message.error("Failed to remove questions.");
    }
  };

  return (
    <Card style={{ padding: 20 }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Space wrap>
          <Select
            placeholder="Select Category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 200 }}
          >
            {categories.map((c) => (
              <Option key={c.id} value={c.category}>
                {c.category}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Select Test Series"
            value={selectedTestSeries}
            onChange={setSelectedTestSeries}
            style={{ width: 200 }}
          >
            {testSeries.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.examTitle}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Select Test Paper"
            value={selectedTestPaper}
            onChange={setSelectedTestPaper}
            style={{ width: 200 }}
          >
            {testPapers.map((p) => (
              <Option key={p.id} value={p.id}>
                {p.testTitle}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Select Section"
            value={selectedSection}
            onChange={setSelectedSection}
            style={{ width: 200 }}
          >
            {sections.map((s) => (
              <Option key={s.id} value={s.section}>
                {s.section}
              </Option>
            ))}
          </Select>
        </Space>

        <Typography.Title level={5}>Select Questions</Typography.Title>
        {selectedQuestions.length > 0 && (
          <Typography>
            Selected Questions: <b>{selectedQuestions.length}</b>
          </Typography>
        )}
        {selectedSection && (
          <Typography>
            Questions available in section <b>{selectedSection}</b>:{" "}
            {sectionQuestionCount ?? "Loading..."}
          </Typography>
        )}

        <List
          bordered
          style={{ maxHeight: 300, overflowY: "auto" }}
          dataSource={questions}
          renderItem={(q) => (
            <List.Item onClick={() => handleQuestionSelect(q.id)}>
              <div
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <Checkbox
                  checked={selectedQuestions.includes(q.id)}
                  onChange={() => handleQuestionSelect(q.id)}
                />
                <span
                  style={{ marginLeft: 12 }}
                >{`[${q.id}] ${q.createQuestion}`}</span>
              </div>
            </List.Item>
          )}
        />

        <Button type="primary" onClick={handleAddQuestionsToTestPaper}>
          Add Questions To Test Paper
        </Button>

        {testPaperQuestions.length > 0 && (
          <>
            <Typography.Title level={5}>
              Total Questions: <b>{questionCount}</b>
            </Typography.Title>
            <Table
            size="small"
              dataSource={testPaperQuestions.sort((a, b) => b.id - a.id)}
              rowKey="id"
              pagination={{ pageSize: 100 }}
            >
              <Table.Column
                title="Select"
                render={(_, record) => (
                  <Checkbox
                    checked={selectedRemoveQuestions.includes(record.id)}
                    onChange={() => handleRemoveSelect(record.id)}
                  />
                )}
              />
              <Table.Column title="Question ID" dataIndex="id" />
              <Table.Column title="Question" dataIndex="createQuestion" />
              <Table.Column title="Section" dataIndex="section" />
            </Table>
            <Button danger onClick={handleRemoveQuestions}>
              Remove Selected Questions
            </Button>
          </>
        )}
      </Space>
    </Card>
  );
};

export default AddQuestion;
