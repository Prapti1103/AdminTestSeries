import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  message,
} from "antd";
import { getAllUsers, createUser } from "../api/AllApi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  // ✅ Load users
  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch {
      message.error("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ Create User
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      await createUser(values);

      message.success("User Created Successfully");

      setOpen(false);
      form.resetFields();
      loadUsers();
    } catch {
      message.error("Error creating user");
    }
  };

  // ✅ Table columns (same as screenshot)
  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Username", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Contact", dataIndex: "mobNo" },
    { title: "Exam", dataIndex: "exam" },
    { title: "District", dataIndex: "district" },
  ];

  return (
    <>
      {/* 🔥 Top Buttons */}
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setOpen(true)}>
          + Add User
        </Button>
      </div>

      {/* 🔥 Table */}
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
      />

      {/* 🔥 Modal (exact same UI style) */}
      <Modal
        title="Create User"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Username"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="confirmPassword" label="Confirm Password">
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mobNo"
                label="Contact Number"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="paidAmount" label="Paid Amount">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="district"
            label="District"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "Nagpur", label: "Nagpur" },
                { value: "Pune", label: "Pune" },
                { value: "Satara", label: "Satara" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="exam"
            label="Exam Name"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "UPSC", label: "UPSC" },
                { value: "MPSC", label: "MPSC" },
                { value: "Railway", label: "Railway" },
              ]}
            />
          </Form.Item>

          {/* 🔥 Buttons */}
          <div style={{ textAlign: "left" }}>
            <Button type="primary" onClick={handleCreate}>
              Create
            </Button>

            <Button
              style={{ marginLeft: 10 }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}