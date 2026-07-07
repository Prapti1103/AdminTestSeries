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
  Card,
} from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

import {
  getAllSections,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  // getAllPapers,
} from "./TestSeriesAPI";

import MathLiveInput from "./MathLiveInput";

const { Option } = Select;
const { TextArea } = Input;

const CreateQuestion = () => {

  const [form] = Form.useForm();

  const [sections, setSections] = useState([]);
  // const [papers, setPapers] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [filterSection, setFilterSection] = useState("");
  const [filterType, setFilterType] = useState("");

  const [questionCount, setQuestionCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const [showOptionE, setShowOptionE] = useState(false);

  const [editingQuestion, setEditingQuestion] = useState(null);

  const questionType = Form.useWatch("questionType", form);

  // FETCH QUESTIONS
  const fetchQuestions = () => {

    getAllQuestions()
      .then((res) => {

        console.log("QUESTIONS API:", res.data);

        setQuestions(res.data);

        setQuestionCount(res.data.length);

      })
      .catch(() => {

        Swal.fire(
          "Error",
          "Failed to fetch questions",
          "error"
        );

      });
  };

  // LOAD INITIAL DATA
  useEffect(() => {

    getAllSections()
      .then((res) => {

        setSections(res.data);

      })
      .catch(() => {

        Swal.fire(
          "Error",
          "Failed to fetch sections",
          "error"
        );

      });

    // getAllPapers()
    //   .then((res) => {

    //     setPapers(res.data);

    //   })
    //   .catch(() => {

    //     Swal.fire(
    //       "Error",
    //       "Failed to fetch papers",
    //       "error"
    //     );

    //   });

    fetchQuestions();

  }, []);

  // SUBMIT
  const handleFinish = async (values) => {

    try {

      // const payload = {

      //   ...values,

      //   section: values.section
      //     ? JSON.parse(values.section)
      //     : null,

      //   paper: values.paper
      //     ? JSON.parse(values.paper)
      //     : null,
      // };
      const payload = {
  ...values,
  section: values.section
    ? JSON.parse(values.section)
    : null,
};

      console.log("QUESTION PAYLOAD:", payload);

      if (editingQuestion) {

        await updateQuestion(
          editingQuestion.id,
          payload
        );

        Swal.fire(
          "Updated",
          "Question updated successfully",
          "success"
        );

      } else {

        await createQuestion(payload);

        Swal.fire(
          "Success",
          "Question added successfully",
          "success"
        );
      }

      setShowForm(false);

      form.resetFields();

      setShowOptionE(false);

      setEditingQuestion(null);

      fetchQuestions();

    } catch (error) {

      console.error(error);

      Swal.fire(
        "Error",
        "Something went wrong!",
        "error"
      );
    }
  };

  // EDIT
  const handleEdit = (question) => {

    // form.setFieldsValue({

    //   ...question,

    //   section: JSON.stringify(question.section),

    //   paper: JSON.stringify(question.paper),
    // });
    form.setFieldsValue({
  ...question,
  section: JSON.stringify(question.section),
});

    setShowForm(true);

    setEditingQuestion(question);

    setShowOptionE(!!question.optionE);
  };

  // DELETE
  const handleDelete = async (id) => {

    try {

      await deleteQuestion(id);

      Swal.fire(
        "Deleted!",
        "Question deleted successfully",
        "success"
      );

      fetchQuestions();

    } catch {

      Swal.fire(
        "Error",
        "Failed to delete question",
        "error"
      );
    }
  };

  // FILTER
  const filteredQuestions = questions.filter((q) => {

    return (

      (!filterSection ||
        q.section?.name === filterSection)

      &&

      (!filterType ||
        q.questionType === filterType)

      &&

      (!searchQuery ||

        q.questionText
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()))
    );
  });

  return (

    <div style={{ padding: 24 }}>

      <Space
        direction="horizontal"
        size="middle"
        style={{ marginBottom: 16 }}
      >

        <Typography.Text strong>
          Total Que: {questionCount}
        </Typography.Text>

      </Space>

      <div style={{ marginBottom: 16 }}>

        {!showForm ? (

          <Space style={{ marginBottom: 16 }}>

            <Button
              type="primary"
              onClick={() => setShowForm(true)}
            >
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

                <Option
                  key={s.id}
                  value={s.name}
                >
                  {s.name}
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

              <Option value="Descriptive">
                Descriptive
              </Option>

            </Select>

            <Input
              placeholder="Search Question"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              style={{ width: 300 }}
            />

          </Space>

        ) : (

          <Card
            variant="outlined"
            style={{ marginBottom: 24 }}
          >

            <Typography.Title
              level={4}
              style={{ textAlign: "center" }}
            >

              {editingQuestion
                ? "Update Question"
                : "Create Question"}

            </Typography.Title>

            <Form
              layout="vertical"
              form={form}
              onFinish={handleFinish}
            >

              <Row gutter={16}>

                <Col span={8}>

                  <Form.Item
                    label="Question"
                    name="questionText"
                  >

                    <MathLiveInput
                      value={form.getFieldValue("questionText")}
                      onChange={(val) =>
                        form.setFieldValue(
                          "questionText",
                          val
                        )
                      }
                    />

                  </Form.Item>

                </Col>

                <Col span={8}>

                  <Form.Item
                    label="Question Type"
                    name="questionType"
                  >

                    <Select>

                      <Option value="MCQ">
                        MCQ
                      </Option>

                      <Option value="Descriptive">
                        Descriptive
                      </Option>

                    </Select>

                  </Form.Item>

                </Col>

                <Col span={8}>

                  <Form.Item
                    label="Section"
                    name="section"
                  >

                    <Select>

                      {sections.map((s) => (

                        <Option
                          key={s.id}
                          value={JSON.stringify({
                            id: s.id,
                            name: s.name,
                          })}
                        >

                          {s.name}

                        </Option>

                      ))}

                    </Select>

                  </Form.Item>

                </Col>

                {/* <Col span={8}>

                  <Form.Item
                    label="Paper"
                    name="paper"
                  >

                    <Select placeholder="Select Paper">

                      {papers.map((p) => (

                        <Option
                          key={p.id}
                          value={JSON.stringify({
                            id: p.id,
                            name: p.name,
                          })}
                        >

                          {p.name}

                        </Option>

                      ))}

                    </Select>

                  </Form.Item>

                </Col> */}

              </Row>

              {questionType === "MCQ" && (

                <Row gutter={16}>

                  {["A", "B", "C", "D"].map((opt) => (

                    <Col span={12} key={opt}>

                      <Form.Item
                        label={`Option ${opt}`}
                        name={`option${opt}`}
                      >

                        <MathLiveInput
                          value={form.getFieldValue(`option${opt}`)}
                          onChange={(val) =>
                            form.setFieldValue(
                              `option${opt}`,
                              val
                            )
                          }
                        />

                      </Form.Item>

                    </Col>

                  ))}

                </Row>

              )}

              <Row gutter={16}>

                <Col span={8}>

                  <Form.Item
                    label="Correct Answer"
                    name="correctAnswer"
                  >

                    <Select>

                      {["A", "B", "C", "D"].map((opt) => (

                        <Option
                          key={opt}
                          value={opt}
                        >

                          Option {opt}

                        </Option>

                      ))}

                    </Select>

                  </Form.Item>

                </Col>

                <Col span={8}>

                  <Form.Item
                    label="Marks"
                    name="marks"
                  >

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

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                  >

                    {editingQuestion
                      ? "Update"
                      : "Submit"}

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
        dataSource={[...filteredQuestions]
          .sort((a, b) => b.id - a.id)}
        rowKey="id"
        columns={[

          {
            title: "Id",
            dataIndex: "id",
            key: "id",
          },

          {
            title: "Question",

            render: (_, record) => (

              <Button
                type="link"
                onClick={() => handleEdit(record)}
              >

                {record.questionText ||
                  "No Question"}

              </Button>

            ),
          },

          {
            title: "Type",
            dataIndex: "questionType",
          },

          {
            title: "Section",

            render: (_, record) =>
              record.section?.name || "N/A",
          },

          // {
          //   title: "Paper",

          //   render: (_, record) =>
          //     record.paper?.name || "N/A",
          // },

          {
            title: "Actions",

            render: (_, record) => (

              <Button
                icon={<DeleteOutlined />}
                onClick={() =>
                  handleDelete(record.id)
                }
                danger
              />

            ),
          },

        ]}
      />

    </div>
  );
};
export default CreateQuestion;