// Converted version of CreateQuestion component using Ant Design (AntD)

import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  Typography,
  Table,
  Space,
  Upload,
  Form,
  Row,
  Col,
  Divider,
  message,
  Card,
} from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  getAllSections,
  getQuestionsCountBySection,
  getTotalQuestionCount,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "./TestSeriesAPI";
import MathLiveInput from "./MathLiveInput";
import { Editor } from "@tinymce/tinymce-react";

const { Option } = Select;
const { TextArea } = Input;

const CreateQuestion = () => {
  const [form] = Form.useForm();
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterSection, setFilterSection] = useState("");
  const [filterType, setFilterType] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [sectionCounts, setSectionCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showOptionE, setShowOptionE] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const questionType = Form.useWatch("questionType", form);

  const [pageSize, setPageSize] = useState(1000);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAllSections()
      .then((res) => {
        setSections(res.data);
        fetchCountsBySection(res.data);
      })
      .catch(() => Swal.fire("Error", "Failed to fetch sections", "error"));

    fetchQuestions();
  }, []);

  useEffect(() => {
    getTotalQuestionCount()
      .then((res) => setQuestionCount(res.data.totalQuestions))
      .catch(() =>
        Swal.fire("Error", "Failed to fetch total questions", "error")
      );
  }, []);

  const fetchCountsBySection = async (sections) => {
    const counts = {};
    for (const section of sections) {
      const res = await getQuestionsCountBySection(section.section);
      counts[section.section] = res.data.count;
    }
    setSectionCounts(counts);
  };

  const fetchQuestions = () => {
    getAllQuestions()
      .then((res) => setQuestions(res.data))
      .catch(() => Swal.fire("Error", "Failed to fetch questions", "error"));
  };

  const handleFinish = async (values) => {
    const formData = new FormData();
    for (const key in values) {
      if (key.includes("File")) {
        const fileList = values[key];
        if (Array.isArray(fileList) && fileList.length > 0) {
          formData.append(key, fileList[0].originFileObj);
        }
      } else {
        formData.append(key, values[key]);
      }
    }

    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, formData);
        Swal.fire("Updated", "Question updated successfully", "success");
      } else {
        await createQuestion(formData);
        Swal.fire("Success", "Question added successfully", "success");
      }
      setShowForm(false);
      form.resetFields();
      setShowOptionE(false);
      setEditingQuestion(null);
      fetchQuestions();
    } catch {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleEdit = (question) => {
    form.setFieldsValue({ ...question });
    setShowForm(true);
    setEditingQuestion(question);
    setShowOptionE(!!question.optionE);
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
      Swal.fire("Deleted!", "Question deleted successfully", "success");
      fetchQuestions();
    } catch {
      Swal.fire("Error", "Failed to delete question", "error");
    }
  };

  const filteredQuestions = questions.filter((q) => {
    return (
      (!filterSection || q.section === filterSection) &&
      (!filterType || q.questionType === filterType) &&
      (!searchQuery ||
        q.createQuestion?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div style={{ padding: 24 }}>
      <Space direction="horizontal" size="middle" style={{ marginBottom: 16 }}>
        <Typography.Text strong>Total Que: {questionCount}</Typography.Text>
        {Object.entries(sectionCounts)
          .filter(([s]) => !filterSection || s === filterSection)
          .map(([section, count]) => (
            <Typography.Text key={section}>
              {section}: {count} Que
            </Typography.Text>
          ))}
      </Space>

      <div style={{ marginBottom: 16 }}>
        {!showForm ? (
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={() => setShowForm(true)}>
              Create Question
            </Button>
            <Select
              placeholder="Section"
              style={{ width: 160 }}
              value={filterSection}
              onChange={setFilterSection}
              allowClear
            >
              {sections.map((s) => (
                <Option key={s.id} value={s.section}>
                  {s.section}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Type"
              style={{ width: 160 }}
              value={filterType}
              onChange={setFilterType}
              allowClear
            >
              <Option value="MCQ">MCQ</Option>
              <Option value="Descriptive">Descriptive</Option>
            </Select>
            <Input
              placeholder="Search Question"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 300 }}
            />
          </Space>
        ) : (
          <Card bordered style={{ marginBottom: 24 }}>
            <Typography.Title level={4} style={{ textAlign: "center" }}>
              {editingQuestion ? "Update Question" : ""}
            </Typography.Title>

            <Form layout="vertical" form={form} onFinish={handleFinish}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Question" name="createQuestion">
                    {editingQuestion &&
                    editingQuestion.createQuestion?.startsWith("http") ? (
                      <img
                        src={editingQuestion.createQuestion}
                        alt="Question"
                        style={{
                          maxHeight: "100px",
                          display: "block",
                          marginBottom: 8,
                        }}
                      />
                    ) : null}
                    <Form.Item noStyle name="createQuestion">
                      <MathLiveInput
                        value={form.getFieldValue("createQuestion")}
                        onChange={(val) =>
                          form.setFieldValue("createQuestion", val)
                        }
                      />
                    </Form.Item>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Question Type" name="questionType">
                    <Select
                      onChange={(v) =>
                        setShowOptionE(v === "MCQ" ? false : showOptionE)
                      }
                    >
                      <Option value="MCQ">MCQ</Option>
                      <Option value="Descriptive">Descriptive</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Section" name="section">
                    <Select>
                      {sections.map((s) => (
                        <Option key={s.id} value={s.section}>
                          {s.section}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="createQuestionFile"
                valuePropName="fileList"
                getValueFromEvent={(e) => e && e.fileList}
              >
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>
                    Upload Question Image
                  </Button>
                </Upload>
              </Form.Item>

              {questionType === "MCQ" && (
                <Row gutter={16}>
                  {["A", "B", "C", "D"].map((opt) => (
                    <Col span={12} key={opt}>
                      <Form.Item label={`Option ${opt}`} name={`option${opt}`}>
                        {editingQuestion &&
                        editingQuestion[`option${opt}`]?.startsWith("http") ? (
                          <img
                            src={editingQuestion[`option${opt}`]}
                            alt={`Option ${opt}`}
                            style={{
                              maxHeight: "80px",
                              display: "block",
                              marginBottom: 8,
                            }}
                          />
                        ) : null}
                        <MathLiveInput
                          value={form.getFieldValue(`option${opt}`)}
                          onChange={(val) =>
                            form.setFieldValue(`option${opt}`, val)
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        name={`option${opt}File`}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}
                      >
                        <Upload beforeUpload={() => false} maxCount={1}>
                          <Button icon={<UploadOutlined />}>
                            Upload Option {opt} Image
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  ))}

                  {showOptionE ? (
                    <Col span={12}>
                      <Form.Item label="Option E" name="optionE">
                        <MathLiveInput
                          value={form.getFieldValue("optionE")}
                          onChange={(val) => form.setFieldValue("optionE", val)}
                        />
                      </Form.Item>

                      <Form.Item
                        name="optionEFile"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}
                      >
                        <Upload beforeUpload={() => false} maxCount={1}>
                          <Button icon={<UploadOutlined />}>
                            Upload Option E Image
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  ) : (
                    <Col
                      span={12}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Button onClick={() => setShowOptionE(true)}>
                        + Add Option E
                      </Button>
                    </Col>
                  )}
                </Row>
              )}

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Correct Answer" name="correctAnswer">
                    <Select>
                      {["A", "B", "C", "D", ...(showOptionE ? ["E"] : [])].map(
                        (opt) => (
                          <Option key={opt} value={opt}>
                            Option {opt}
                          </Option>
                        )
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Marks" name="marks">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Answer Explanation"
                    name="answerExplanation"
                  >
                    <TextArea rows={1} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Button type="primary" htmlType="submit" block>
                    {editingQuestion ? "Update" : "Submit"}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    onClick={() => {
                      setShowForm(false);
                      form.resetFields();
                      setEditingQuestion(null);
                    }}
                    block
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        )}
      </div>
      <Table
        size="small"
        dataSource={[...filteredQuestions].sort((a, b) => b.id - a.id)}
        rowKey="id"
        columns={[
          { title: "Id", dataIndex: "id", key: "id" },
          {
            title: "Question",
            dataIndex: "createQuestion",
            render: (text, record) => (
              <Button type="link" onClick={() => handleEdit(record)}>
                {text}
              </Button>
            ),
          },
          { title: "Type", dataIndex: "questionType" },
          { title: "Section", dataIndex: "section" },
          {
            title: "Actions",
            render: (_, record) => (
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
                danger
              />
            ),
          },
        ]}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page) => setCurrentPage(page),
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
    </div>
  );
};

export default CreateQuestion;
