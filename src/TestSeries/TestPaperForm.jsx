import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Switch,
  Checkbox,
  Row,
  Col,
  Typography,
  DatePicker,
  TimePicker,
  message,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import {
  createTestPaper,
  updateTestPaper,
  getAllTestSeries,
  getAllSections,
  getTestPaperById,
} from "./TestSeriesAPI";

const { Title, Text } = Typography;
const { TextArea } = Input;

const defaultTestPaper = {
  testTitle: "",
  status: true, // Active by default
  showTestResult: false, // Hidden by default
  noOfQuestions: "",
  totalMarks: "",
  duration: "",
  testStartDate: "",
  testEndDate: "",
  startTime: "",
  endTime: "",
  testSeries: { id: "" },
  sections: [],
  multipleAttemptsAllowed: false,
  maxAttemptsAllowed: 1,
  terms: "",
};

const TestPaperForm = () => {
  const { testPaperId } = useParams();
  const navigate = useNavigate();
  const [testPaper, setTestPaper] = useState(defaultTestPaper);
  const [testSeriesList, setTestSeriesList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const isEditing = Boolean(testPaperId);

  // Fetch Test Series and Sections
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seriesRes, sectionsRes] = await Promise.all([
          getAllTestSeries(),
          getAllSections(),
        ]);
        setTestSeriesList(seriesRes.data || []);
        setSectionsList(sectionsRes.data || []);
      } catch (err) {
        setTestSeriesList([]);
        setSectionsList([]);
      }
    };
    fetchData();
  }, []);

  // Fetch test paper details if editing
  useEffect(() => {
    if (isEditing) {
      const fetchTestPaper = async () => {
        setLoading(true);
        try {
          const res = await getTestPaperById(testPaperId);
          const data = res.data;

          const paperData = {
            ...data,
            testSeries: data.testSeries || { id: "" },
            sections: data.sections || [],
            multipleAttemptsAllowed: !!data.multipleAttemptsAllowed,
            maxAttemptsAllowed: data.multipleAttemptsAllowed
              ? data.maxAttemptsAllowed
              : 1,
            startTime: data.startTime,
            endTime: data.endTime,
            status: data.status !== undefined ? data.status : true,
            showTestResult:
              data.showTestResult !== undefined ? data.showTestResult : false,
          };

          setTestPaper(paperData);
          form.setFieldsValue({
            ...paperData,
            testSeries: paperData.testSeries.id,
            sections: paperData.sections.map((s) => s.id),
            testStartDate: dayjs(data.testStartDate),
            testEndDate: dayjs(data.testEndDate),
            startTime: dayjs(paperData.startTime, "HH:mm"),
            endTime: dayjs(paperData.endTime, "HH:mm"),
          });
        } catch (err) {
          Swal.fire("Error!", "Failed to fetch test paper details.", "error");
        }
        setLoading(false);
      };
      fetchTestPaper();
    } else {
      setTestPaper(defaultTestPaper);
      form.setFieldsValue(defaultTestPaper);
    }
  }, [isEditing, testPaperId]);

  const handleChange = (name, value) => {
    setTestPaper((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (values) => {
    if (!values.testSeries) {
      message.error("Please select a valid test series.");
      return;
    }

    try {
      setLoading(true);

      // Combine date and time for LocalDateTime fields
      const formattedStartTime = `${values.testStartDate}T${values.startTime}:00`;
      const formattedEndTime = `${values.testEndDate}T${values.endTime}:00`;

      const payload = {
        ...values,
        testStartDate: values.testStartDate.format("YYYY-MM-DD"),
        testEndDate: values.testEndDate.format("YYYY-MM-DD"),
        startTime: values.startTime.format("YYYY-MM-DDTHH:mm:ss"),
        endTime: values.endTime.format("YYYY-MM-DDTHH:mm:ss"),
        multipleAttemptsAllowed: values.multipleAttemptsAllowed,
        maxAttemptsAllowed: values.multipleAttemptsAllowed
          ? values.maxAttemptsAllowed
          : 1,
        testSeries: { id: values.testSeries },
        sections: sectionsList.filter((section) =>
          values.sections.includes(section.id)
        ),
        ...(isEditing
          ? {}
          : { showTestResult: values.showTestResult || false }),
      };

      if (isEditing) {
        await updateTestPaper(testPaperId, payload);
        Swal.fire("Success!", "Test Paper updated successfully!", "success");
      } else {
        await createTestPaper(payload);
        Swal.fire("Success!", "Test Paper created successfully!", "success");
      }
      navigate(-1);
    } catch (error) {
      message.error(`Error ${isEditing ? "updating" : "creating"} Test Paper.`);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Card
      bordered
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: 8,
      }}
    >
      <Title
        level={4}
        style={{ textAlign: "center", marginTop: -5, padding: 1 }}
      >
        {isEditing ? "Update Test Paper" : ""}
      </Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...testPaper,
          status: testPaper.status !== undefined ? testPaper.status : true,
          showTestResult:
            testPaper.showTestResult !== undefined
              ? testPaper.showTestResult
              : false,
        }}
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Test Title"
              name="testTitle"
              rules={[{ required: true, message: "Please enter test title" }]}
            >
              <Input
                placeholder="Enter test title"
                onChange={(e) => handleChange("testTitle", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Select Test Series"
              name="testSeries"
              rules={[{ required: true, message: "Please select test series" }]}
            >
              <Select placeholder="Select a Test Series">
                {testSeriesList.map((series) => (
                  <Select.Option key={series.id} value={series.id}>
                    {series.examTitle}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Select Sections"
              name="sections"
              rules={[{ required: true, message: "Please select sections" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select sections"
                optionLabelProp="label"
                onChange={(selectedIds) => {
                  form.setFieldsValue({ sections: selectedIds });
                  const selectedSections = sectionsList.filter((section) =>
                    selectedIds.includes(section.id)
                  );
                  setTestPaper((prev) => ({
                    ...prev,
                    sections: selectedSections,
                  }));
                }}
              >
                {sectionsList.length > 0 ? (
                  sectionsList.map((section) => (
                    <Select.Option
                      key={section.id}
                      value={section.id}
                      label={section.section}
                    >
                      <Checkbox
                        checked={testPaper.sections.some(
                          (s) => s.id === section.id
                        )}
                      />
                      {section.section}
                    </Select.Option>
                  ))
                ) : (
                  <Select.Option disabled value="no-sections">
                    No Sections Available
                  </Select.Option>
                )}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="No Of Questions"
              name="noOfQuestions"
              rules={[
                { required: true, message: "Please enter number of questions" },
              ]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                onChange={(value) => handleChange("noOfQuestions", value)}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Total Marks"
              name="totalMarks"
              rules={[{ required: true, message: "Please enter total marks" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                onChange={(value) => handleChange("totalMarks", value)}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Duration (minutes)"
              name="duration"
              rules={[{ required: true, message: "Please enter duration" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                onChange={(value) => handleChange("duration", value)}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Start Date"
              name="testStartDate"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                onChange={(date, dateString) =>
                  handleChange("testStartDate", dateString)
                }
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="End Date"
              name="testEndDate"
              rules={[{ required: true, message: "Please select end date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                onChange={(date, dateString) =>
                  handleChange("testEndDate", dateString)
                }
              />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              label="Status"
              name="status"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                defaultChecked={true}
                onChange={(checked) => handleChange("status", checked)}
              />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              name="showTestResult"
              valuePropName="checked"
              label="Show Test Results"
              initialValue={false}
            >
              <Switch
                checkedChildren="Visible"
                unCheckedChildren="Hidden"
                defaultChecked={false}
                onChange={(checked) => handleChange("showTestResult", checked)}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Start Time"
              name="startTime"
              rules={[{ required: true, message: "Please select start time" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                onChange={(time, timeString) =>
                  handleChange("startTime", timeString)
                }
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="End Time"
              name="endTime"
              rules={[{ required: true, message: "Please select end time" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm"
                onChange={(time, timeString) =>
                  handleChange("endTime", timeString)
                }
              />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              name="multipleAttemptsAllowed"
              valuePropName="checked"
              label="Allow Multiple Attempts"
            >
              <Switch
                onChange={(checked) => {
                  handleChange("multipleAttemptsAllowed", checked);
                  if (!checked) {
                    form.setFieldsValue({ maxAttemptsAllowed: 1 });
                  }
                }}
              />
            </Form.Item>
          </Col>

          {form.getFieldValue("multipleAttemptsAllowed") && (
            <Col span={4}>
              <Form.Item
                label="Max Attempts Allowed"
                name="maxAttemptsAllowed"
                rules={[
                  { required: true, message: "Please enter max attempts" },
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  onChange={(value) =>
                    handleChange("maxAttemptsAllowed", value)
                  }
                />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item
              label="Terms & Conditions"
              name="terms"
              rules={[{ required: true, message: "Terms & Conditions" }]}
            >
              <TextArea
                rows={3}
                onChange={(e) => handleChange("terms", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%", maxWidth: 200 }}
            >
              {isEditing ? "Update" : "Submit"}
            </Button>
          </Col>

          <Col span={12}>
            <Button
              style={{ width: "100%", maxWidth: 200 }}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default TestPaperForm;
