import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu } from "antd";
import { AppstoreOutlined, UserOutlined } from "@ant-design/icons";
import TestSeries from "../TestSeries/TestSeries";
import "./layout.css";
import Users from "../TestSeries/Pages/Users";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {

  // ✅ CHANGE 1 (default tab)
  const [activeTab, setActiveTab] = useState("testSeries");

  const [collapsed, setCollapsed] = useState(true);
  const siderRef = useRef();

  // ✅ TAB MAPPING (NO CHANGE)
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (siderRef.current && !siderRef.current.contains(event.target)) {
        setCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: "Test Series",
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Users",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <Sider
        ref={siderRef}
        collapsible
        collapsed={collapsed}
        onClick={() => setCollapsed(false)}
        onCollapse={(value) => setCollapsed(value)}
        className="sidebar"
        width={220}
        collapsedWidth={60}
      >
        <div style={{
          padding: "20px",
          fontSize: "20px",
          fontWeight: "600",
          color: "white",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}>
        </div>

        {/* ✅ CHANGE 2 (menu click handler add) */}
        <Menu
          mode="inline"
          items={menuItems}
          onClick={({ key }) => {
            if (key === "1") setActiveTab("testSeries");
            if (key === "2") setActiveTab("users");
          }}
        />
      </Sider>

      {/* MAIN */}
      <Layout>

        <Header className="topbar">
          <div className="header-inner">
            <div>MAHASTUDY</div>
            <div className="user">
              <div className="circle">U</div>
            </div>
          </div>
        </Header>

        {/* TOP TABS */}
        <div className="tabs-wrapper">
          <div className="top-tabs">
            {tabs.map((tab) => {
              const value = tabMap[tab];

              return (
                <div
                  key={tab}
                  className={`tab ${activeTab === value ? "active" : ""}`}
                  onClick={() => setActiveTab(value)}
                >
                  {tab}
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ CHANGE 3 (content condition render) */}
        <Content className="content">

          {activeTab === "testSeries" && (
            <TestSeries activeTab={activeTab} />
          )}

          {activeTab === "users" && <Users />}

        </Content>

      </Layout>
    </Layout>
  );
};

export default MainLayout;