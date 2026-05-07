import React, { useState } from "react";
import { Layout, Menu } from "antd";

import {
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";

import TestSeries from "../TestSeries/TestSeries";
import Users from "../TestSeries/Pages/Users";

import "./layout.css";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {

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

              <div className="circle">
                U
              </div>

            </div>

          </div>

        </Header>

        {/* TABS */}
        {activeTab !== "users" && (

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