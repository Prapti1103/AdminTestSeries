import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Typography,
  Space,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const loginApi = axios.create({
  baseURL: "http://localhost:8080",
});

const AdminLogin = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      console.log("🔵 Login Request:", values);

      const response = await loginApi.post("/admin/login", {
        email: values.email,
        password: values.password,
      });

      console.log("✅ Login Response:", response.data);

      // TOKEN
      const token = response.data.token;

      if (!token) {
        message.error("Token not received");
        return;
      }

      // STORE TOKEN
      sessionStorage.setItem("token", token);

      console.log("✅ Token Saved:", token);

      message.success("Login Successful");

      onLoginSuccess();

    } catch (error) {
      console.error("❌ Login Error:", error);

      if (error.response?.data) {
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
        <Space
          direction="vertical"
          style={{ width: "100%" }}
          align="center"
        >
          <Title level={2} style={{ marginBottom: 0 }}>
            Admin Login
          </Title>

          <Text type="secondary">
            MAHASTUDY Admin Panel
          </Text>
        </Space>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          style={{ marginTop: 30 }}
        >
          <Form.Item
            name="email"
            initialValue="admin@pjsofttech.com"
            rules={[
              {
                required: true,
                message: "Please enter email",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            initialValue="admin"
            rules={[
              {
                required: true,
                message: "Please enter password",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Text
          type="secondary"
          style={{
            fontSize: 12,
            display: "block",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          PJSOFTTECH
        </Text>
      </Card>
    </div>
  );
};

export default AdminLogin;