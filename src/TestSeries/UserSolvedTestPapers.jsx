// src/components/UserSolvedTestPapers.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Typography, Spin, Row, Col } from "antd";
import { getAllSolvedTestPapers } from "../../API/AllApi";

const UserSolvedTestPapers = () => {
  const { userId } = useParams();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSolvedPapers = async () => {
      setLoading(true);
      try {
        const res = await getAllSolvedTestPapers(userId);
        setPapers(res.data);
      } catch (error) {
        console.error("Error loading solved test papers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolvedPapers();
  }, [userId]);

  const columns = [
    {
      title: "Sr No",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Test Name",
      dataIndex: "testTitle",
      key: "testTitle",
    },
    {
      title: "Score",
      dataIndex: "totalScore",
      key: "totalScore",
    },
    {
      title: "Correct Answers",
      dataIndex: "correctQuestions",
      key: "correctQuestions",
    },
    {
      title: "Incorrect Answers",
      dataIndex: "incorrectQuestions",
      key: "incorrectQuestions",
    },{
      title: "Unsolved Questions",
      dataIndex: "unsolvedQuestions",
      key: "unsolvedQuestions",
    },
    // {
    //   title: "Total Attempt",
    //   dataIndex: "attemptNumber",
    //   key: "attemptNumber",
    // },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Typography.Title level={3}>Solved Test Papers</Typography.Title>
        </Col>
        
      </Row>

        <div style={{ textAlign: "right", marginBottom: 4 }}>
        <span style={{ fontSize: "13px", color: "#666" }}>
         Total: {papers.length}
        </span>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Table
        size="small"
          dataSource={papers}
          columns={columns}
          rowKey={(record, index) => index}
          pagination={{ pageSize: 100 }}
        />
      )}
    </>
  );
};

export default UserSolvedTestPapers;
