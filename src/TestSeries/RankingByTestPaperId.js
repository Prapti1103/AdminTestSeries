import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Tablediv,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Results
        </Typography>
        <Button
          onClick={handleBackFromRanking}
          variant="contained"
          sx={{ bgcolor: "#0086B9", mb: 2 }}
        >
          Back
        </Button>
        <Button
          onClick={handleDownload}
          variant="contained"
          sx={{ bgcolor: "#4CAF50", mb: 2, ml: 2 }}
        >
          Download Pdf
        </Button>
        <Tablediv component={Paper}>
          <Table size="small" pagination={{ pageSize: 100 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Score</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Q.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Correct</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Incorrect</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Unsolved</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankingData.map((rank, index) => (
                <TableRow key={index}>
                  <TableCell>{rank.rank}</TableCell>
                  <TableCell>{rank.userName}</TableCell>
                  <TableCell>{rank.email}</TableCell>
                  <TableCell>{rank.contact}</TableCell>
                  <TableCell>{rank.totalScore}</TableCell>
                  <TableCell>{rank.totalMarks}</TableCell>
                  <TableCell>{rank.noOfQuestions}</TableCell>
                  <TableCell>{rank.correctQuestions}</TableCell>
                  <TableCell>{rank.incorrectQuestions}</TableCell>
                  <TableCell>{rank.unsolvedQuestions}</TableCell>
                  <TableCell>{rank.totalTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tablediv>
      </CardContent>
    </Card>
  );
};

export default RankingByTestPaperId;
