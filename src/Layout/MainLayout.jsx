import React, { useState } from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import AdminProfile from "../TestSeries/Pages/AdminProfile";
import {
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

import TestSeries from "../TestSeries/TestSeries";
import Users from "../TestSeries/Pages/Users";

import "./layout.css";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();

  // DEFAULT PAGE
  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [collapsed, setCollapsed] =
    useState(true);

  // TOP NAV TABS
  const tabMap = {
    Dashboard: "dashboard",
    Series: "createTestSeries",
    Paper: "createTestPaper",
    "Question Bank": "createQuestion",
    "Add Question": "addQuestion",
    "Solved Paper": "solvedTestPaper",
    Settings: "settings",
  };

  const tabs = Object.keys(tabMap);

  // SIDEBAR
  const menuItems = [
    {
      key: "testseries",
      icon: <AppstoreOutlined />,
      label: "Test Series",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: "Admin Profile",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === "profile") {
      setActiveTab("profile");
    } else if (key === "logout") {
      AuthService.logout();
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) =>
          setCollapsed(value)
        }
        className="sidebar"
        width={220}
        collapsedWidth={60}
      >

        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={[
            activeTab === "users"
              ? "users"
              : "testseries",
          ]}
          onClick={({ key }) => {

            if (key === "users") {

              setActiveTab("users");

            } else {

              // OPEN DASHBOARD
              setActiveTab("dashboard");

            }
          }}
        />

      </Sider>

      {/* MAIN */}
      <Layout>

        {/* HEADER */}
        <Header className="topbar">

          <div className="header-inner">

            <div className="logo">
              MAHASTUDY
            </div>

            <div className="user">
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                trigger={["click", "hover"]}
                placement="bottomRight"
                arrow
              >
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: "#1f4f8a",
                    cursor: "pointer",
                  }}
                />
              </Dropdown>
            </div>

          </div>

        </Header>

        {/* TABS */}
        {activeTab !== "users" && activeTab !== "profile" && (

          <div className="tabs-wrapper">

            <div className="top-tabs">

              {tabs.map((tab) => {

                const value = tabMap[tab];

                return (
                  <button
                    key={value}
                    type="button"
                    className={`tab ${
                      activeTab === value
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveTab(value)
                    }
                  >
                    {tab}
                  </button>
                );
              })}

            </div>

          </div>

        )}

        {/* CONTENT */}
        <Content className="content">

          {activeTab === "users" ? (
            <Users />
          ) : activeTab === "profile" ? (
            <AdminProfile />
          ) : (
            <TestSeries
              activeTab={activeTab}
            />
          )}

        </Content>

      </Layout>

    </Layout>
  );
};

export default MainLayout;