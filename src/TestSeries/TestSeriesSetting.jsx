import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";

import CreateCategory from "./CreateCategory";
import CreateSection from "./CreateSection";

// ✅ Sidebar items (Ant Design icons)
const menuItems = [
  { id: "categories", label: "Test Categories", icon: <AppstoreOutlined /> },
  { id: "sections", label: "Test Sections", icon: <BarsOutlined /> },
];

// ✅ Sidebar Component
const Sidebar = ({ menuItems, activeTab, setActiveTab, isExpanded, setIsExpanded }) => {
  return (
    <div
      style={{
        width: isExpanded ? "160px" : "50px",
        background: "#2f75b5",
        borderRadius: "30px",
        padding: "10px",
        transition: "0.3s",
        height: "fit-content",
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {menuItems.map((item) => (
        <Tooltip
          key={item.id}
          title={!isExpanded ? item.label : ""}
          placement="right"
        >
          <div
            onClick={() => setActiveTab(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              marginBottom: "10px",
              cursor: "pointer",
              borderRadius: "20px",
              background: activeTab === item.id ? "white" : "transparent",
              color: activeTab === item.id ? "#2f75b5" : "white",
              fontWeight: activeTab === item.id ? "600" : "normal",
            }}
          >
            {item.icon}
            {isExpanded && item.label}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

// ✅ Main Component
const TestSeriesSetting = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [isExpanded, setIsExpanded] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "categories":
        return <CreateCategory />;
      case "sections":
        return <CreateSection />;
      default:
        return <CreateCategory />;
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <div style={{ display: "flex", gap: "20px" }}>

        {/* ✅ Sidebar */}
        <Sidebar
          menuItems={menuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />

        {/* ✅ Content */}
        <div style={{ flex: 1 }}>
          <Card
            style={{
              borderRadius: "10px",
              height:" 100%",
            }}
          >
            {/* Header */}
            <h3 style={{ marginBottom: "25px"  }}>
              {activeTab === "categories"
                ? "Test Categories"
                : "Test Sections"}
            </h3>

            {/* Content */}
            {renderContent()}
          </Card>
        </div>

      </div>
    </div>
  );
};

export default TestSeriesSetting;