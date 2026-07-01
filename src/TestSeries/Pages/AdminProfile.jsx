import React from "react";
import {
  Card,
  Avatar,
  Typography,
  Tag,
  Row,
  Col,
  Descriptions,
} from "antd";

import {
  UserOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

import AuthService from "../../services/authService";

const { Title, Text } = Typography;

export default function AdminProfile() {

  const admin = AuthService.getAdminDetails();

  const formatDate = (timestamp) => {

    if (!timestamp) return "-";

    return new Date(timestamp * 1000).toLocaleString();

  };

  return (

    <Row justify="center">

      <Col xs={24} md={18} lg={14}>

        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >

          <div
            style={{
              textAlign: "center",
              marginBottom: 35,
            }}
          >

            <Avatar
              size={90}
              icon={<UserOutlined />}
            />

            <Title
              level={3}
              style={{
                marginTop: 15,
                marginBottom: 5,
              }}
            >
              {admin?.name || "Administrator"}
            </Title>

            <Tag
              color="green"
              icon={<SafetyCertificateOutlined />}
            >
              {admin?.role || "Administrator"}
            </Tag>

          </div>

          <Descriptions
            bordered
            column={1}
            size="middle"
          >

            <Descriptions.Item label="Email">

              {admin?.email}

            </Descriptions.Item>

            <Descriptions.Item label="Role">

              {admin?.role}

            </Descriptions.Item>

            <Descriptions.Item label="Access">

              Full System Access

            </Descriptions.Item>

            <Descriptions.Item label="Environment">

              {import.meta.env.DEV
                ? "Development"
                : "Production"}

            </Descriptions.Item>

            <Descriptions.Item label="Authentication">

              JWT Token

            </Descriptions.Item>

            <Descriptions.Item label="Token Issued">

              {formatDate(admin?.issuedAt)}

            </Descriptions.Item>

            <Descriptions.Item label="Token Expires">

              {formatDate(admin?.expiresAt)}

            </Descriptions.Item>

            <Descriptions.Item label="Status">

              <Text type="success">

                Logged In

              </Text>

            </Descriptions.Item>

          </Descriptions>

        </Card>

      </Col>

    </Row>

  );

}