import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Typography,
  Upload,
  message,
} from "antd";
import {
  DeleteOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  getAllVTCategories,
  getAllTestSeries,
  createTestSeries,
  updateTestSeries,
  deleteTestSeries,
  uploadTestSeriesImage,
  updateTestSeriesImage,
} from "./TestSeriesAPI";
import { Editor } from "@tinymce/tinymce-react";

const { Title, Text } = Typography;
const { TextArea } = Input;

function CreateTestSeries() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [testSeriesList, setTestSeriesList] = useState([]);
  const [selectedTestSeries, setSelectedTestSeries] = useState(null);
  const [createdTestSeriesId, setCreatedTestSeriesId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTestSeries();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllVTCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    }
  };

  const fetchTestSeries = async () => {
    setLoading(true);
    try {
      const response = await getAllTestSeries();
      setTestSeriesList(response.data);
    } catch (error) {
      console.error("Error fetching test series:", error);
      message.error("Failed to fetch test series");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      let response;
      if (selectedTestSeries) {
        response = await updateTestSeries(selectedTestSeries.id, values);
        message.success("Test Series Updated!");
      } else {
        response = await createTestSeries(values);
        message.success("Test Series Created!");
        setCreatedTestSeriesId(response.data.id);
      }
      await fetchTestSeries();
      resetForm();
      setShowForm(false);
    } catch (error) {
      message.error("Failed to process request");
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "You won't be able to revert this!",
      okText: "Yes, delete it!",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteTestSeries(id);
          setTestSeriesList((prev) => prev.filter((item) => item.id !== id));
          message.success("Test series has been deleted.");
        } catch (error) {
          message.error("Failed to delete test series.");
        }
      },
    });
  };

  const handleUpdate = (test) => {
    setSelectedTestSeries(test);
    form.setFieldsValue({
      ...test,
      status: test.status ? true : false,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    form.resetFields();
    setSelectedTestSeries(null);
    setImageFile(null);
  };

  const uploadImage = async (id, isUpdate = false) => {
    if (!imageFile) {
      message.error("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      if (isUpdate) {
        await updateTestSeriesImage(id, formData);
        message.success("Image updated successfully!");
      } else {
        await uploadTestSeriesImage(id, formData);
        message.success("Image uploaded successfully!");
      }
      await fetchTestSeries();
    } catch (error) {
      message.error("Failed to process image");
    }
  };

  const beforeUpload = (file) => {
    setImageFile(file);
    return false;
  };

  const filteredTestSeries = testSeriesList.filter((test) => {
    const categoryMatch = !filterCategory || test.category === filterCategory;
    const statusMatch =
      !filterStatus ||
      (filterStatus === "active" && test.status) ||
      (filterStatus === "inactive" && !test.status);
    return categoryMatch && statusMatch;
  });

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "examTitle",
      key: "examTitle",
      render: (text, record) => (
        <Button type="link" onClick={() => handleUpdate(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) =>
        text ? (
          <img
            src={text}
            alt="Test Series"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "pricing",
      key: "pricing",
    },
    {
      title: "Mrp",
      dataIndex: "mrp",
      key: "mrp",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {!showForm && (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col>
            <Button
              type="primary"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              Create Chamipon Series
            </Button>
          </Col>

          <Col>
            <Select
              placeholder="Filter by Category"
              style={{ width: 200 }}
              value={filterCategory}
              onChange={setFilterCategory}
              allowClear
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.category}>
                  {cat.category}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col>
            <Select
              placeholder="Filter by Status"
              style={{ width: 200 }}
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
            >
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Col>
        </Row>
      )}

      {!showForm ? (
        <Card>
          <Table
            size="small"
            columns={columns}
            dataSource={[...filteredTestSeries].reverse()}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 100 }}
          />
        </Card>
      ) : (
        <Card>
          <Title level={4} style={{ textAlign: "center" }}>
            {selectedTestSeries ? "Update Test Series" : ""}
          </Title>
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Row gutter={16}>
                            <Col span={6}>
                <Form.Item
                  name="seo"
                  label="SEO"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="examTitle"
                  label="Test Series Title"
                  rules={[{ required: true, message: "Please input title" }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="pricing"
                  label="Price"
                  rules={[{ required: true, message: "Please input price" }]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="mrp"
                  label="Mrp"
                  rules={[{ required: true, message: "Please input MRP" }]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[
                    { required: true, message: "Please select category" },
                  ]}
                >
                  <Select>
                    {categories.map((cat) => (
                      <Select.Option key={cat.id} value={cat.category}>
                        {cat.category}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="testFeatureOne"
                  label="Test Feature One"
                  rules={[{ required: true, message: "Please input feature" }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="testFeatureTwo"
                  label="Test Feature Two"
                  rules={[{ required: true, message: "Please input feature" }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="testFeatureThree"
                  label="Test Feature Three"
                  rules={[{ required: true, message: "Please input feature" }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="status" valuePropName="checked">
                  <Checkbox>Active</Checkbox>
                </Form.Item>
              </Col>

              <Col span={24}>
     <Form.Item
            name="description"
            label="Description"
          // ✅ CHANGE 1: Tell AntD which prop holds value
  valuePropName="value"

  // ✅ CHANGE 2: Tell AntD which event updates value
  trigger="onEditorChange"

  // ✅ CHANGE 3: Extract ONLY the HTML string
  getValueFromEvent={(content) => content}

  rules={[{ required: true, message: "Please input description" }]}
          >
            <Editor
              apiKey="a33mv5veov956mfdjzlpnalh3gavme0aao6q4p90q1cft4ud"
              initialValue={form.getFieldValue("description") || ""}
              init={{
                height: 500,
               menubar: 'file edit view insert format tools table help',

  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
    'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'paste', 'help', 'wordcount'
  ],

  // Toolbar with link option
  toolbar:
    'undo redo | formatselect fontselect fontsizeselect | ' +
    'bold italic underline forecolor backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | ' +
    'link image table | removeformat | code fullscreen help',

  // Right-click menu (shows Link Ctrl+K)
  contextmenu: 'link image table',

  // Font sizes
  font_size_formats:
    '8px 10px 12px 14px 16px 18px 20px 24px 30px 36px',

  content_style:
    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
}}
              onEditorChange={(content) => {
                form.setFieldsValue({ description: content });
              }}
            />
          </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Space>
              <Button type="primary" htmlType="submit">
                {selectedTestSeries ? "Update" : "Create"}
              </Button>
              <Button onClick={() => setShowForm(false)}>Cancel</Button>
            </Space>

            <Divider />

            <Form.Item label="Image">
              <Upload
                beforeUpload={beforeUpload}
                maxCount={1}
                showUploadList={true}
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
              <Button
                type="primary"
                onClick={() =>
                  uploadImage(
                    selectedTestSeries?.id || createdTestSeriesId,
                    !!selectedTestSeries
                  )
                }
                style={{ marginTop: 8 }}
                disabled={!imageFile}
              >
                {selectedTestSeries ? "Update Image" : "Upload Image"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
}

export default CreateTestSeries;
