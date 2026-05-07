import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Table,
  Typography,
  Space,
  message,
} from "antd";
import { getRanking } from "./TestSeriesAPI";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const RankingByTestPaperId = () => {
  const { testPaperId } = useParams();
  const [rankingData, setRankingData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await getRanking(testPaperId);
        setRankingData(res.data || []);
      } catch (error) {
        Swal.fire("Error!", "Failed to fetch ranking data.", "error");
      }
    };
    fetchRanking();
  }, [testPaperId]);

  const handleBackFromRanking = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    if (rankingData.length === 0) {
      Swal.fire("Error!", "No ranking data available to download.", "error");
      return;
    }

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.width;
    const marginLeft = 10; // left margin
    const marginRight = 10; // right margin
    const usablePageWidth = pageWidth - marginLeft - marginRight;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Ranking Results", pageWidth / 2, 20, { align: "center" });

    // Define headers matching your UI table
    const headers = [
      [
        "Rank",
        "Name",
        "Total Marks",
        "Questions",
        "Score",
        "Correct",
        "Incorrect",
        "Unsolved",
        "Total Time",
      ],
    ];

    // Map data to match headers
    const data = rankingData.map((rank) => [
      rank.rank,
      rank.userName,
      rank.totalMarks,
      rank.noOfQuestions,
      rank.totalScore,
      rank.correctQuestions,
      rank.incorrectQuestions,
      rank.unsolvedQuestions,
      rank.totalTime,
    ]);

    // Customize autoTable styles to match your UI table design
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      styles: {
        font: "helvetica",
        fontSize: 8, // smaller font size for better fit
        cellPadding: 2,
        overflow: "linebreak",
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [0, 102, 204], // same as your header color
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 30, left: marginLeft, right: marginRight },
      theme: 'grid', // optional, for grid lines similar to table borders
    });

    // Generate PDF data as blob
    const pdfBlob = doc.output("blob");

    // Create a URL for the blob and open in new tab
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  };

  const columns = [
    { title: "Rank", dataIndex: "rank", key: "rank" },
    { title: "Name", dataIndex: "userName", key: "userName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "contact", key: "contact" },
    { title: "Score", dataIndex: "totalScore", key: "totalScore" },
    { title: "Total", dataIndex: "totalMarks", key: "totalMarks" },
    { title: "Q.", dataIndex: "noOfQuestions", key: "noOfQuestions" },
    { title: "Correct", dataIndex: "correctQuestions", key: "correctQuestions" },
    { title: "Incorrect", dataIndex: "incorrectQuestions", key: "incorrectQuestions" },
    { title: "Unsolved", dataIndex: "unsolvedQuestions", key: "unsolvedQuestions" },
    { title: "Time", dataIndex: "totalTime", key: "totalTime" },
  ];

  return (
    <Card style={{ marginTop: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          style={{ backgroundColor: "#0086B9" }}
          onClick={handleBackFromRanking}
        >
          Back
        </Button>
        <Button
          type="primary"
          style={{ backgroundColor: "#4CAF50" }}
          onClick={handleDownload}
        >
          Download PDF
        </Button>
      </Space>
      <Table 
        columns={columns} 
        dataSource={rankingData} 
        rowKey="rank"
        pagination={{ pageSize: 100 }} 
      />
    </Card>
  );
};

export default RankingByTestPaperId;
