
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
  Tag,
} from "antd";

import {
  getAllSections,
  getQuestionCount,
  getTestPaperQuestions,
  removeQuestionsFromTestPaper,
  addQuestionsToTestPaper,
  getAllQuestions,
} from "./TestSeriesAPI";

import { GetAllCategories } from "./TestSeriesAPI";

const { Option } = Select;

// const API_URL = "http://localhost:8080";
const API_URL = "https://mahastudy.in";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {

    const token = sessionStorage.getItem("token");

   if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

    return config;
  },

  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {

    if (
      error.response &&
      error.response.status === 401
    ) {

      sessionStorage.removeItem("token");

      window.location.href = "/admin";
    }

    return Promise.reject(error);
  }
);

const AddQuestion = () => {

  const [questions, setQuestions] =
    useState([]);

  const [testSeries, setTestSeries] =
    useState([]);

  const [testPapers, setTestPapers] =
    useState([]);

  const [sections, setSections] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [
    selectedTestSeries,
    setSelectedTestSeries,
  ] = useState("");

  const [
    selectedTestPaper,
    setSelectedTestPaper,
  ] = useState("");

  const [
    selectedSection,
    setSelectedSection,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [
    selectedRemoveQuestions,
    setSelectedRemoveQuestions,
  ] = useState([]);

  const [
    testPaperQuestions,
    setTestPaperQuestions,
  ] = useState([]);

  const [
    questionCount,
    setQuestionCount,
  ] = useState(0);

  const [
    sectionQuestionCount,
    setSectionQuestionCount,
  ] = useState(null);

  // FETCH TEST SERIES
 const fetchTestSeries = async () => {

  try {

    const response = await api.get(
      "/AllTestSeriesNames"
    );

    console.log(
      "TEST SERIES RESPONSE:",
      response.data
    );

    const data = Array.isArray(response.data)
      ? response.data
      : [];

    setTestSeries(data);

  } catch (error) {

    console.error(
      "Test series error:",
      error
    );
  }
};

  // FETCH TEST PAPERS
  const fetchTestPapers = async (id) => {

  try {

    const response = await api.get(
      "/GetAllPapers"
    );

    console.log(
      "TEST PAPERS RESPONSE:",
      response.data
    );

    const allPapers = Array.isArray(
      response.data
    )
      ? response.data
      : [];

    const filteredPapers =
      allPapers.filter(

        (paper) =>

          paper.testSeries?.id == id ||

          paper.testSeriesId == id ||

          paper.testSeries?.testSeriesId == id
      );

    setTestPapers(filteredPapers);

  } catch (error) {

    console.error(
      "Test papers error:",
      error
    );
  }
};
  // FETCH SECTIONS
  const fetchSections = async () => {

    try {

      const res = await getAllSections();

      setSections(res.data);

    } catch (e) {

      console.error(
        "Sections error:",
        e
      );
    }
  };

  // FETCH CATEGORIES
  const fetchCategories = async () => {

    try {

      const res =
        await GetAllCategories();

      setCategories(res.data);

    } catch (e) {

      console.error(
        "Categories error:",
        e
      );
    }
  };

  // FETCH QUESTIONS
  const fetchQuestions = async (
    section
  ) => {

    try {

      const res =
        await getAllQuestions();

      const filtered =
        res.data.filter(

          (q) =>

            q.section &&
            q.section.name === section
        );

      setQuestions(filtered);

    } catch (e) {

      console.error(
        "Questions error:",
        e
      );
    }
  };

  // FETCH TEST PAPER QUESTIONS
  const fetchTestPaperQuestions =
    async (id) => {

      try {

        const res =
          await getTestPaperQuestions(
            id
          );

        setTestPaperQuestions(
          res.data
        );

      } catch (e) {

        console.error(
          "TP Questions error:",
          e
        );
      }
    };

  // FETCH TOTAL COUNT
  const fetchQuestionCount =
    async (id) => {

      try {

        const res =
          await getQuestionCount(id);

        setQuestionCount(
          res.data
        );

      } catch (e) {

        console.error(
          "Question count error:",
          e
        );
      }
    };

  // FETCH SECTION COUNT
  const fetchSectionQuestionCount =
    async (section) => {

      try {

        const res =
          await getAllQuestions();

        const count =
          res.data.filter(

            (q) =>

              q.section &&
              q.section.name ===
                section

          ).length;

        setSectionQuestionCount(
          count
        );

      } catch (e) {

        console.error(
          "Section question count error:",
          e
        );
      }
    };

  useEffect(() => {

    fetchTestSeries();

    fetchSections();

    fetchCategories();

  }, []);

  useEffect(() => {

    if (selectedTestSeries) {

      fetchTestPapers(
        selectedTestSeries
      );
    }

  }, [selectedTestSeries]);

  useEffect(() => {

    if (selectedTestPaper) {

      fetchTestPaperQuestions(
        selectedTestPaper
      );

      fetchQuestionCount(
        selectedTestPaper
      );
    }

  }, [selectedTestPaper]);

  useEffect(() => {

    if (selectedSection) {

      fetchQuestions(
        selectedSection
      );

      fetchSectionQuestionCount(
        selectedSection
      );
    }

  }, [selectedSection]);

  // AUTO ADD QUESTION
  const handleQuestionSelect =
    async (id) => {

      if (!selectedTestPaper) {

        return message.error(
          "Please select test paper first"
        );
      }

      try {

        await addQuestionsToTestPaper(
          selectedTestPaper,
          [id]
        );

        message.success(
          "Question added successfully"
        );

        fetchTestPaperQuestions(
          selectedTestPaper
        );

        fetchQuestionCount(
          selectedTestPaper
        );

      } catch (e) {

        console.error(
          "Add error:",
          e
        );

        message.error(
          "Failed to add question."
        );
      }
    };

  // REMOVE SELECT
  const handleRemoveSelect =
    (id) => {

      setSelectedRemoveQuestions(
        (prev) =>

          prev.includes(id)

            ? prev.filter(
                (q) => q !== id
              )

            : [...prev, id]
      );
    };

  // REMOVE QUESTIONS
  const handleRemoveQuestions =
    async () => {

      if (
        !selectedTestPaper ||
        selectedRemoveQuestions.length ===
          0
      ) {

        return alert(
          "Select paper and questions."
        );
      }

      try {

        await removeQuestionsFromTestPaper(
          selectedTestPaper,
          selectedRemoveQuestions
        );

        message.success(
          "Removed successfully."
        );

        setSelectedRemoveQuestions([]);

        fetchTestPaperQuestions(
          selectedTestPaper
        );

        fetchQuestionCount(
          selectedTestPaper
        );

      } catch (e) {

        console.error(
          "Remove error:",
          e
        );

        message.error(
          "Failed to remove questions."
        );
      }
    };

  return (

    <Card style={{ padding: 20 }}>

      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size="large"
      >

        <Space wrap>

          {/* CATEGORY */}

          <div>

            <Typography.Text strong>
              Select Category
            </Typography.Text>

            <br />

            <Select
              placeholder="Select Category"
              value={selectedCategory}
              onChange={
                setSelectedCategory
              }
              style={{ width: 200 }}
            >

              {categories.map((c) => (

                <Option
                  key={c.id}
                  value={
                    c.name ||
                    c.category
                  }
                >

                  {c.name ||
                    c.category}

                </Option>

              ))}

            </Select>

          </div>

          {/* TEST SERIES */}

          <div>

            <Typography.Text strong>
              Select Test Series
            </Typography.Text>

            <br />

            <Select
              placeholder="Select Test Series"
              value={
                selectedTestSeries
              }
              onChange={
                setSelectedTestSeries
              }
              style={{ width: 220 }}
            >

              {testSeries.map((s) => (

                <Option
                  key={s.id}
                  value={s.id}
                >

                  {s.examTitle ||
 s.testSeriesName ||
 s.title ||
 s.name ||
 "Unnamed Series"}

                </Option>

              ))}

            </Select>

          </div>

          {/* TEST PAPER */}

          <div>

            <Typography.Text strong>
              Select Test Paper
            </Typography.Text>

            <br />

            <Select
              placeholder="Select Test Paper"
              value={
                selectedTestPaper
              }
              onChange={
                setSelectedTestPaper
              }
              style={{ width: 220 }}
            >

              {testPapers.map((p) => (

                <Option
                  key={p.id}
                  value={p.id}
                >

                 {p.name ||
 p.paperName ||
 p.paperTitle ||
 p.testTitle ||
 "Unnamed Paper"}

                </Option>

              ))}

            </Select>

          </div>

          {/* SECTION */}

          <div>

            <Typography.Text strong>
              Select Section
            </Typography.Text>

            <br />

            <Select
              placeholder="Select Section"
              value={
                selectedSection
              }
              onChange={
                setSelectedSection
              }
              style={{ width: 250 }}
            >

              {sections.map((s) => (

                <Option
                  key={s.id}
                  value={s.name}
                >

                  {s.name ||
                    s.section}

                </Option>

              ))}

            </Select>

          </div>

        </Space>

        {/* SECTION COUNT */}

        {selectedSection && (

          <Typography>

            Questions available in
            section

            <Tag color="blue">

              {selectedSection}

            </Tag>

            :
            {" "}
            {sectionQuestionCount ??
              "Loading..."}

          </Typography>

        )}

        {/* QUESTION LIST */}

        <List
          bordered
          style={{
            maxHeight: 300,
            overflowY: "auto",
          }}
          dataSource={questions}
          renderItem={(q) => (

            <List.Item
              onClick={() =>
                handleQuestionSelect(
                  q.id
                )
              }
              style={{
                cursor: "pointer",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  width: "100%",
                }}
              >

                <Checkbox
                  checked={false}
                />

                <span
                  style={{
                    marginLeft: 12,
                  }}
                >

                  [{q.id}]
                  {" "}
                  {q.questionText}

                </span>

              </div>

            </List.Item>

          )}
        />

        {/* TEST PAPER QUESTIONS */}

        {testPaperQuestions.length >
          0 && (

          <>

            <Typography.Title level={5}>

              Total Questions:
              <b>
                {" "}
                {questionCount}
              </b>

            </Typography.Title>

            <Table
              size="small"
              dataSource={[
                ...testPaperQuestions,
              ].sort(
                (a, b) =>
                  b.id - a.id
              )}
              rowKey="id"
              pagination={{
                pageSize: 100,
              }}
            >

              <Table.Column
                title="Select"
                render={(
                  _,
                  record
                ) => (

                  <Checkbox
                    checked={selectedRemoveQuestions.includes(
                      record.id
                    )}
                    onChange={() =>
                      handleRemoveSelect(
                        record.id
                      )
                    }
                  />

                )}
              />

              <Table.Column
                title="Question ID"
                dataIndex="id"
              />

              <Table.Column
                title="Question"
                dataIndex="questionText"
              />

              <Table.Column
                title="Section"
                render={(
                  _,
                  record
                ) =>
                  record.section
                    ?.name ||
                  "N/A"
                }
              />

              <Table.Column
                title="Paper"
                render={(
                  _,
                  record
                ) =>
                  record.paper
                    ?.name ||
                  "N/A"
                }
              />

            </Table>

            <Button
              danger
              onClick={
                handleRemoveQuestions
              }
            >

              Remove Selected
              Questions

            </Button>

          </>

        )}

      </Space>

    </Card>
  );
};

export default AddQuestion;

