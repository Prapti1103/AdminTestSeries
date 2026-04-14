import React, { useEffect, useState } from "react";
import { 
  Typography, 
  Divider, 
  Spin, 
  Alert, 
  Row, 
  Col, 
  Button, 
  Grid, 
  message, 
  Progress 
} from "antd";
import { 
  DownloadOutlined, 
  CheckCircleOutlined, 
  LoadingOutlined 
} from "@ant-design/icons";
import { getAllTestpapers } from "./TestSeriesAPI";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../img/logo.png";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// Message functions similar to the advanced PDF generator
const showPdfGeneratingMessage = () => {
  message.loading({
    content: "Generating PDF...",
    key: "pdf-status",
    duration: 0,
  });
};

const showPdfGeneratedSuccessMessage = () => {
  message.success({
    content: "PDF generated and downloaded successfully!",
    key: "pdf-status",
    duration: 3,
  });
};

const showPdfGenerationFailedMessage = (errorMsg) => {
  message.error({
    content: `PDF generation failed: ${errorMsg}`,
    key: "pdf-status",
    duration: 4,
  });
};

const hideMessage = () => {
  message.destroy("pdf-status");
};

export default function QuestionsByTestPaperId() {
  const { testPaperId } = useParams();
  const screens = useBreakpoint();

  const [testPaper, setTestPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const fetchTestPaper = async () => {
      try {
        const res = await getAllTestpapers();
        const found = res.data.find((t) => t.id === parseInt(testPaperId));
        setTestPaper(found || null);
      } catch (err) {
        setError("Failed to fetch test paper.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestPaper();
  }, [testPaperId]);

  /**
   * Generate questions HTML with 2 options per row and proper page breaks
   * @param {Array} questions - Array of question objects
   * @returns {string} HTML for questions
   */
  const generateQuestionsHTML = (questions) => {
    if (!questions || questions.length === 0) {
      return '<div style="text-align: center; color: #666; font-style: italic; padding: 20px; font-size: 10px;">Questions will be available soon.</div>';
    }

    return questions
      .map((question, index) => {
        const questionText = question.createQuestion || `Question ${index + 1}`;

        // Get all valid options
        const validOptions = ["A", "B", "C", "D", "E"]
          .map((opt) => {
            const optValue = question[`option${opt}`];
            return optValue && optValue.trim()
              ? { letter: opt, value: optValue.trim() }
              : null;
          })
          .filter(Boolean);

        // Group options into pairs for 2 options per row
        const optionPairs = [];
        for (let i = 0; i < validOptions.length; i += 2) {
          optionPairs.push(
            [validOptions[i], validOptions[i + 1]].filter(Boolean)
          );
        }

        const optionsHTML = optionPairs
          .map((pair) => {
            if (pair.length === 2) {
              // Two options in a row
              return `
                <div class="option-row">
                  <div class="option">
                    <span class="option-letter">${pair[0].letter}.</span>${pair[0].value}
                  </div>
                  <div class="option">
                    <span class="option-letter">${pair[1].letter}.</span>${pair[1].value}
                  </div>
                </div>
              `;
            } else {
              // Single option (odd number of options)
              return `
                <div class="option-row">
                  <div class="option single-option">
                    <span class="option-letter">${pair[0].letter}.</span>${pair[0].value}
                  </div>
                </div>
              `;
            }
          })
          .join("");

        return `
          <div class="question">
            <div class="question-text">${index + 1}. ${questionText}</div>
            <div class="options-div">
              ${optionsHTML}
            </div>
          </div>
        `;
      })
      .join("");
  };

  /**
   * Generate HTML with updated styling for better page breaks and 2 options per row
   * @param {Object} testPaper - Test paper object
   * @returns {string} HTML content with updated styling
   */
  const generateHTMLWithExactStyling = (testPaper) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Test Paper</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 15px;
            line-height: 1.3;
            position: relative;
            font-size: 10px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 20px;
            position: relative;
            z-index: 2;
          }
          
          .header h1 {
            color: #333;
            font-size: 14px;
            margin-bottom: 6px;
            font-weight: bold;
          }
          
          .header p {
            font-size: 9px;
            color: #666;
            margin: 0;
          }
          
          .info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
            font-size: 9px;
          }
          
          .info-left, .info-right {
            flex: 1;
          }
          
          .info-right {
            text-align: right;
          }
          
          .info p {
            margin: 2px 0;
            font-size: 9px;
          }
          
          .question {
            margin: 0 0 15px 0;
            padding: 8px;          
            border-left: 2px solid #007bff;
            background-color: rgba(0, 123, 255, 0.05);
            position: relative;
            z-index: 2;
            page-break-inside: avoid;
            break-inside: avoid;
            min-height: 60px;
          }
          
          .question-text {
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
            font-size: 10px;
            line-height: 1.2;
          }

          .content {
            padding-top: 8px;
          }
          
          .options-div {
            margin-top: 6px;
          }
          
          .option-row {
            display: flex;
            gap: 10px;
            margin-bottom: 6px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .option {
            flex: 1;
            padding: 4px 6px;
            border: 1px solid #e8e8e8;
            border-radius: 3px;
            background-color: #ffffff;
            min-height: 12px;
            display: flex;
            align-items: center;
            font-size: 9px;
          }
          
          .option.single-option {
            max-width: 48%;
          }
          
          .option-letter {
            font-weight: bold;
            color: #007bff;
            margin-right: 4px;
            min-width: 12px;
            flex-shrink: 0;
            font-size: 9px;
          }
          
          .instructions {
            background-color: #f8f9fa;
            padding: 8px;
            border-radius: 4px;
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
            page-break-inside: avoid;
            font-size: 9px;
          }
          
          .instructions h3 {
            margin-top: 0;
            margin-bottom: 6px;
            color: #495057;
            font-size: 10px;
          }
          
          .instructions ul {
            margin-bottom: 0;
            padding-left: 15px;
          }
          
          .instructions li {
            margin-bottom: 2px;
            font-size: 8px;
            line-height: 1.2;
          }
          
          hr {
            border: 0;
            height: 1px;
            background: #ddd;
            margin: 12px 0;
          }
          
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 8px;
            position: relative;
            z-index: 2;
          }
          
          /* Print-specific styles */
          @media print {
            body { 
              margin: 0;
              font-size: 9px;
            }
            
            .question {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 12px;
            }
            
            .option-row {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            .instructions {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
          
          /* Webkit browsers page break support */
          @page {
            margin: 0.8cm;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${testPaper.testTitle || "Test Paper"}</h1>
          <p>Please read all instructions carefully before starting</p>
        </div>
        
        <div class="info">
          <div class="info-left">
            <p><strong>Name: ____________________</strong></p>
            <p><strong>Roll No.: ________________</strong></p>
            <p><strong>Date: ____________________</strong></p>
          </div>
          <div class="info-right">
            <p><strong>Duration: ${
              testPaper.duration || "N/A"
            } minutes</strong></p>
            <p><strong>Total Marks: ${
              testPaper.totalMarks || "N/A"
            }</strong></p>
            <p><strong>Total Questions: ${
              testPaper.noOfQuestions || "N/A"
            }</strong></p>
          </div>
        </div>
        
        <div class="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Read each question carefully before answering</li>
            <li>Choose the best answer from the given options</li>
            <li>Mark your answers clearly</li>
            <li>Manage your time effectively</li>
            <li>Review your answers before submitting</li>
          </ul>
        </div>
        
        <hr>
        
        <div class="content">
          ${generateQuestionsHTML(testPaper.questions || [])}
        </div>
        
        <div class="footer">
          <p>Software developed by PJSofttech Pvt. Ltd.</p>
        </div>
      </body>
      </html>
    `;
  };

  /**
   * SMART PDF generation that prevents question splitting
   */
  const downloadHTMLAsPDF = async (htmlContent, fileName) => {
    try {
      // Create temporary iframe for rendering
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      iframe.style.width = "210mm";
      iframe.style.height = "auto";
      iframe.style.border = "none";
      document.body.appendChild(iframe);

      // Write content to iframe
      iframe.contentDocument.open();
      iframe.contentDocument.write(htmlContent);
      iframe.contentDocument.close();

      // Wait for content to fully load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const iframeDocument = iframe.contentDocument;
      const questions = iframeDocument.querySelectorAll(".question");

      if (questions.length === 0) {
        throw new Error("No questions found to render");
      }

      // Create PDF instance
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      // Render header first
      const headerElement = iframeDocument.querySelector(".header");
      const infoElement = iframeDocument.querySelector(".info");
      const instructionsElement = iframeDocument.querySelector(".instructions");

      let currentY = margin;
      let pageNumber = 1;

      // Add header to first page
      if (headerElement) {
        const headerCanvas = await html2canvas(headerElement, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        });

        const headerImgData = headerCanvas.toDataURL("image/jpeg", 0.95);
        const headerHeight =
          (headerCanvas.height * contentWidth) / headerCanvas.width;

        pdf.addImage(
          headerImgData,
          "JPEG",
          margin,
          currentY,
          contentWidth,
          headerHeight
        );
        currentY += headerHeight + 5;
      }

      // Add info section
      if (infoElement) {
        const infoCanvas = await html2canvas(infoElement, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        });

        const infoImgData = infoCanvas.toDataURL("image/jpeg", 0.95);
        const infoHeight =
          (infoCanvas.height * contentWidth) / infoCanvas.width;

        pdf.addImage(
          infoImgData,
          "JPEG",
          margin,
          currentY,
          contentWidth,
          infoHeight
        );
        currentY += infoHeight + 5;
      }

      // Add instructions
      if (instructionsElement) {
        const instructionsCanvas = await html2canvas(instructionsElement, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        });

        const instructionsImgData = instructionsCanvas.toDataURL(
          "image/jpeg",
          0.95
        );
        const instructionsHeight =
          (instructionsCanvas.height * contentWidth) / instructionsCanvas.width;

        if (currentY + instructionsHeight > contentHeight) {
          pdf.addPage();
          currentY = margin;
          pageNumber++;
        }

        pdf.addImage(
          instructionsImgData,
          "JPEG",
          margin,
          currentY,
          contentWidth,
          instructionsHeight
        );
        currentY += instructionsHeight + 10;
      }

      // Process questions one by one
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        // Render individual question
        const questionCanvas = await html2canvas(question, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
          width: question.scrollWidth,
          height: question.scrollHeight,
        });

        const questionImgData = questionCanvas.toDataURL("image/jpeg", 0.95);
        const questionHeight =
          (questionCanvas.height * contentWidth) / questionCanvas.width;

        // Check if question fits on current page
        if (currentY + questionHeight > contentHeight) {
          // Start new page
          pdf.addPage();
          currentY = margin;
          pageNumber++;
        }

        // Add question to PDF
        pdf.addImage(
          questionImgData,
          "JPEG",
          margin,
          currentY,
          contentWidth,
          questionHeight
        );
        currentY += questionHeight + 8; // Add some spacing after each question
      }

      // Add footer to last page
      const footerElement = iframeDocument.querySelector(".footer");
      if (footerElement) {
        const footerCanvas = await html2canvas(footerElement, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        });

        const footerImgData = footerCanvas.toDataURL("image/jpeg", 0.95);
        const footerHeight =
          (footerCanvas.height * contentWidth) / footerCanvas.width;

        if (currentY + footerHeight > contentHeight) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.addImage(
          footerImgData,
          "JPEG",
          margin,
          currentY,
          contentWidth,
          footerHeight
        );
      }

      // Save PDF
      pdf.save(`${fileName}.pdf`);

      // Cleanup
      document.body.removeChild(iframe);
    } catch (error) {
      console.error("PDF generation error:", error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  };

  /**
   * Main function to generate and download PDF with exact advanced design
   */
  const generateAndDownloadTestPaper = async (testPaper, onProgress) => {
    try {
      if (
        !testPaper ||
        !testPaper.questions ||
        testPaper.questions.length === 0
      ) {
        throw new Error("Test paper data is required");
      }

      onProgress && onProgress(10);

      // Show loading indicator
      showPdfGeneratingMessage();

      // Generate HTML content with advanced styling
      const htmlContent = generateHTMLWithExactStyling(testPaper);
      onProgress && onProgress(50);

      // Clean filename
      const cleanTitle = (testPaper.testTitle || "TestPaper")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 30);

      const fileName = `${cleanTitle}_${Date.now()}`;
      onProgress && onProgress(80);

      // Generate PDF using advanced method
      await downloadHTMLAsPDF(htmlContent, fileName);
      onProgress && onProgress(100);

      // Show success message
      showPdfGeneratedSuccessMessage();

      return fileName;
    } catch (error) {
      console.error("❌ Download Error:", error);
      showPdfGenerationFailedMessage(error.message);
      throw error;
    }
  };

  const downloadPDF = async () => {
    if (
      !testPaper ||
      !testPaper.questions ||
      testPaper.questions.length === 0
    ) {
      message.error("No questions available to download");
      return;
    }

    setDownloadLoading(true);
    setDownloadProgress(0);

    try {
      await generateAndDownloadTestPaper(testPaper, (progress) => {
        setDownloadProgress(progress);
      });
    } catch (error) {
      // Error already handled in generateAndDownloadTestPaper
    } finally {
      setDownloadLoading(false);
      setTimeout(() => {
        setDownloadProgress(0);
        hideMessage();
      }, 3000);
    }
  };

  if (loading) return <Spin tip="Loading test paper..." />;
  if (error) return <Alert type="error" message={error} />;
  if (!testPaper) return <Alert message="Test paper not found." type="info" />;

  const questionsExist = testPaper.questions && testPaper.questions.length > 0;

  return (
    <>
      <div style={{ marginTop: 40, display: "flex", gap: "16px" }}>
        <Button onClick={() => window.history.back()}>Back</Button>
        
        {/* Advanced Download Button with Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {downloadLoading && (
            <div style={{ minWidth: "150px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <LoadingOutlined
                  style={{ marginRight: "8px", color: "#007bff" }}
                />
                <Text strong style={{ fontSize: "12px" }}>
                  {downloadProgress < 30
                    ? "Preparing PDF..."
                    : downloadProgress < 80
                    ? "Adding questions..."
                    : downloadProgress < 100
                    ? "Finalizing..."
                    : "Complete!"}
                </Text>
              </div>
              <Progress
                percent={downloadProgress}
                size="small"
                strokeColor="#007bff"
                showInfo={false}
              />
            </div>
          )}

          {questionsExist ? (
            <Button
              type="primary"
              onClick={downloadPDF}
              loading={downloadLoading}
              icon={downloadLoading ? <LoadingOutlined /> : <DownloadOutlined />}
              style={{
                backgroundColor: "#007bff",
                borderColor: "#007bff",
                borderRadius: "4px",
                fontFamily: "Arial, sans-serif",
              }}
              disabled={downloadLoading}
            >
              {downloadLoading ? "Generating PDF..." : "Download PDF"}
            </Button>
          ) : (
            <Alert
              message="Questions not available yet"
              description="Questions will be available soon."
              type="info"
              showIcon
              style={{ marginBottom: 0 }}
            />
          )}

          {downloadProgress === 100 && !downloadLoading && (
            <div
              style={{
                color: "#52c41a",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CheckCircleOutlined style={{ marginRight: "8px" }} />
              <Text style={{ color: "#52c41a" }}>Download completed!</Text>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
        <Title level={3} style={{ textAlign: "center" }}>
          {testPaper.testTitle}
        </Title>

        <Row justify="space-between" style={{ marginBottom: 20 }}>
          <Col>
            <Paragraph>
              <b>Name:</b> __________________
            </Paragraph>
            <Paragraph>
              <b>Roll No:</b> _______________
            </Paragraph>
            <Paragraph>
              <b>Date:</b> _________________
            </Paragraph>
          </Col>
          <Col>
            <Paragraph>
              <b>Duration:</b> {testPaper.duration} mins
            </Paragraph>
            <Paragraph>
              <b>Total Marks:</b> {testPaper.totalMarks}
            </Paragraph>
            <Paragraph>
              <b>Total Questions:</b> {testPaper.noOfQuestions}
            </Paragraph>
          </Col>
        </Row>

        <Divider />

        {testPaper.questions.map((q, i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <Text strong>
              Q{i + 1}: {q.createQuestion}
            </Text>
            <Row gutter={[16, 8]}>
              {["A", "B", "C", "D", "E"].map((opt) => {
                const val = q["option" + opt];
                return (
                  val &&
                  val.trim() && (
                    <Col xs={24} sm={12} key={opt}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                        }}
                      >
                        <Text strong>{opt}.</Text>
                        <Text>{val}</Text>
                      </div>
                    </Col>
                  )
                );
              })}
            </Row>
          </div>
        ))}
      </div>
    </>
  );
}