// TestSeriesManagerLayout.jsx
import { ListAlt } from "@mui/icons-material";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const navItemStyle = {
  padding: "4px 16px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
  color: "white",
  textAlign: "center",
  flex: 1,
  transition: "background-color 0.3s ease, color 0.3s ease",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

const activeNavItemStyle = {
  ...navItemStyle,
  backgroundColor: "white",
  color: "black",
  borderRadius: "30px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
};

const navBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "16px",
  backgroundColor: "#1976D2",
  padding: "8px",
  borderRadius: "30px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
};

const TestSeriesManagerLayout = () => {
  const location = useLocation();

  const isExactActive = (path) => {
    return location.pathname === path;
  };

  const isStartsWithActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div>
      {/* Navbar with navigation buttons */}
      <div style={navBarStyle}>
        {/* Example Navigation Items - replace or add more as needed */}
        <Link
          to="/ebooklayout/test-series-manager"
          style={
            isExactActive("/ebooklayout/test-series-manager")
              ? activeNavItemStyle
              : navItemStyle
          }
        >
          {/* <Dashboard fontSize="small" /> */}
          Dashboard
        </Link>

        <Link
          to="/ebooklayout/test-series-manager/create-test-series"
          style={
            isExactActive("/ebooklayout/test-series-manager/create-test-series")
              ? activeNavItemStyle
              : navItemStyle
          }
        >
          Series
        </Link>

        <Link
          to="/ebooklayout/test-series-manager/test-paper"
          style={
            isExactActive("/ebooklayout/test-series-manager/test-paper")
              ? activeNavItemStyle
              : navItemStyle
          }
        >
          Paper
        </Link>

        <Link
          to="/ebooklayout/test-series-manager/test-question-paper"
          style={
            isExactActive(
              "/ebooklayout/test-series-manager/test-question-paper"
            )
              ? activeNavItemStyle
              : navItemStyle
          }
        >
          Question Bank
        </Link>

        <Link
          to="/ebooklayout/test-series-manager/test-add-question"
          style={
            isExactActive("/ebooklayout/test-series-manager/test-add-question")
              ? activeNavItemStyle
              : navItemStyle
          }
        >
          Add Question
        </Link>

        <Link
          to="/ebooklayout/test-series-manager/solved-paper"
          style={
            isExactActive("/ebooklayout/test-series-manager/solved-paper")
              ? activeNavItemStyle
              : navItemStyle
          }
        >
          Solved Paper
        </Link>

        <Link
          to="/ebooklayout/test-series-manager/test-series-setting"
          style={
            isStartsWithActive(
              "/ebooklayout/test-series-manager/test-series-setting"
            )
              ? activeNavItemStyle
              : navItemStyle
          }
        >
          {/* <SomeIcon fontSize="small" /> */}
          Settings
        </Link>

        <Link
          to="/ebooklayout/test-series-manager/order-list"
          style={
            isExactActive("/ebooklayout/test-series-manager/order-list")
              ? activeNavItemStyle
              : navItemStyle
          }
        >
          {/* <ListAlt fontSize="small" /> */}
          Order List
        </Link>

        {/* Add more navigation links here if needed */}
      </div>

      {/* Content for nested routes */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default TestSeriesManagerLayout;
