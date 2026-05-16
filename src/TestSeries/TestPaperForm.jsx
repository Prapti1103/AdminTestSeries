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
  CreatePaper,
  UpdatePaper,
  getAllTestSeries,
  getAllSections,
  getPaperById,
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
 const params = useParams();
const testPaperId = params.id || params.testPaperId;
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
      } catch {
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
          const res = await getPaperById(testPaperId);
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
           testStartDate: data.testStartDate
  ? dayjs(data.testStartDate)
  : null,

testEndDate: data.testEndDate
  ? dayjs(data.testEndDate)
  : null,

startTime: paperData.startTime
  ? dayjs(paperData.startTime, "HH:mm")
  : null,

endTime: paperData.endTime
  ? dayjs(paperData.endTime, "HH:mm")
  : null,
          });
        } catch {
          Swal.fire("Error!", "Failed to fetch test paper details.", "error");
        }
        setLoading(false);
      };
      fetchTestPaper();
    } else {
      form.setFieldsValue(defaultTestPaper);
    }
  }, [isEditing, testPaperId, form]);

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

     const payload = {
  testTitle: values.testTitle,

  noOfQuestions: values.noOfQuestions,

  totalMarks: values.totalMarks,

  duration: values.duration,

  testStartDate: values.testStartDate
    ? values.testStartDate.format("YYYY-MM-DD")
    : null,

  testEndDate: values.testEndDate
    ? values.testEndDate.format("YYYY-MM-DD")
    : null,

  startTime: values.startTime
    ? values.startTime.format("HH:mm:ss")
    : null,

  endTime: values.endTime
    ? values.endTime.format("HH:mm:ss")
    : null,

  status: values.status ?? true,

  showTestResult:
    values.showTestResult ?? false,

  multipleAttemptsAllowed:
    values.multipleAttemptsAllowed ?? false,

  maxAttemptsAllowed:
    values.multipleAttemptsAllowed
      ? values.maxAttemptsAllowed
      : 1,

  terms: values.terms,

  testSeries: {
    id: values.testSeries,
  },

  sections: (values.sections || []).map(
    (id) => ({ id })
  ),
};

      console.log("📤 Submitting payload:", payload);

      if (isEditing) {
        console.log("🔵 Updating test paper:", testPaperId);
        const response = await UpdatePaper(testPaperId, payload);
        console.log("✅ Update response:", response);
        Swal.fire("Success!", "Test Paper updated successfully!", "success").then(() => {
         navigate("/ebooklayout/test-series-manager/create-test-paper");
        });
      } else {
       console.log("🔵 Creating new test paper");

const finalPayload = {
  ...payload,
  name: values.testTitle,
};

console.log("FINAL PAPER DATA:", finalPayload);

const response = await CreatePaper(finalPayload);
        console.log("✅ Create response:", response);
        Swal.fire("Success!", "Test Paper created successfully!", "success").then(() => {
         navigate("/ebooklayout/test-series-manager/create-test-paper");
        });
      }
    } catch (error) {
      console.error("❌ Error submitting test paper:", error);
      console.error("Error response:", error.response?.data);
      console.log("FULL ERROR", error);

message.error(
  error?.response?.data?.message ||
    error?.response?.data ||
    error.message
);
    }
    setLoading(false);
  };

  const handleCancel = () => {
   navigate("/ebooklayout/test-series-manager/create-test-paper");
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
      {isEditing ? "Update Test Paper" : "Create Test Paper"}
      </Title>

      <Form
        form={form}
        layout="vertical"
       
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
                    {series.examTitle || series.name}
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
      label={section.name || section.section}
    >
      <Checkbox
        checked={testPaper.sections.some(
          (s) => s.id === section.id
        )}
      />
      {section.name || section.section}
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

          <Form.Item shouldUpdate>
  {() =>
    form.getFieldValue("multipleAttemptsAllowed") ? (
      <Col span={4}>
        <Form.Item
          label="Max Attempts Allowed"
          name="maxAttemptsAllowed"
          rules={[
            {
              required: true,
              message: "Please enter max attempts",
            },
          ]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
    ) : null
  }
</Form.Item>

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
