import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Typography,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import useAuth from "../hooks/useAuth";

const { Title, Text } = Typography;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      await login({
        email: values.email,
        password: values.password,
      });
sessionStorage.setItem("adminEmail", values.email);
      message.success("Login Successful");
      navigate("/ebooklayout/test-series-manager", { replace: true });
    } catch (error) {
      console.error("❌ Login Error:", error);

      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.response?.data) {
        message.error(error.response.data);
      } else {
        message.error("Login Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 450,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: 8,
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }} align="center">
          <Title level={2} style={{ marginBottom: 0 }}>
            Admin Login
          </Title>

          <Text type="secondary">MAHASTUDY Admin Panel</Text>
        </Space>

        <Form form={form} layout="vertical" onFinish={handleLogin} style={{ marginTop: 30 }}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 20, textAlign: "center" }}>
          PJSOFTTECH
        </Text>
      </Card>
    </div>
  );
};

export default AdminLogin;