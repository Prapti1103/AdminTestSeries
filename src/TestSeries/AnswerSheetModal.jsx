import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Divider, Card, Row, Col, Spin, message } from 'antd';
import { FilePdfOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const { Title, Text } = Typography;

const AnswerSheetModal = ({ 
  visible, 
  onCancel, 
  testPaper, 
  questions,
  loading 
}) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Process questions to handle the correct data structure
  const processQuestions = (questionsData) => {
    if (!questionsData || questionsData.length === 0) {
      return [];
    }

    return questionsData.map(question => {
      // Create options array from optionA, optionB, etc.
      const options = [];
      if (question.optionA && question.optionA.trim()) options.push(question.optionA);
      if (question.optionB && question.optionB.trim()) options.push(question.optionB);
      if (question.optionC && question.optionC.trim()) options.push(question.optionC);
      if (question.optionD && question.optionD.trim()) options.push(question.optionD);
      if (question.optionE && question.optionE.trim()) options.push(question.optionE);

      return {
        ...question,
        options: options,
        questionText: question.createQuestion || question.questionText,
        correctanswer: question.correctAnswer || question.correctanswer
      };
    });
  };

  const processedQuestions = processQuestions(questions);

  /**
   * Generate questions HTML with answers and explanations
   */
  const generateAnswerSheetHTML = (questions) => {
    if (!questions || questions.length === 0) {
      return '<div style="text-align: center; color: #666; font-style: italic; padding: 20px; font-size: 10px;">Questions will be available soon.</div>';
    }

    return questions
      .map((question, index) => {
        const questionText = question.questionText || `Question ${index + 1}`;

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
              // Two options in a row with correct answer highlighting
              return `
                <div class="option-row">
                  <div class="option ${question.correctanswer === pair[0].letter ? 'correct-option' : ''}">
                    <span class="option-letter">${pair[0].letter}.</span>${pair[0].value}
                    ${question.correctanswer === pair[0].letter ? '<span class="correct-mark">✓</span>' : ''}
                  </div>
                  <div class="option ${question.correctanswer === pair[1].letter ? 'correct-option' : ''}">
                    <span class="option-letter">${pair[1].letter}.</span>${pair[1].value}
                    ${question.correctanswer === pair[1].letter ? '<span class="correct-mark">✓</span>' : ''}
                  </div>
                </div>
              `;
            } else {
              // Single option (odd number of options)
              return `
                <div class="option-row">
                  <div class="option single-option ${question.correctanswer === pair[0].letter ? 'correct-option' : ''}">
                    <span class="option-letter">${pair[0].letter}.</span>${pair[0].value}
                    ${question.correctanswer === pair[0].letter ? '<span class="correct-mark">✓</span>' : ''}
                  </div>
                </div>
              `;
            }
          })
          .join("");

        // Add correct answer section
        const correctAnswerHTML = question.questionType === 'MCQ' 
          ? `<div class="correct-answer-section">
               <strong>Correct Answer: ${question.correctanswer || 'Not specified'}</strong>
             </div>`
          : `<div class="correct-answer-section">
               <strong>Descriptive Question - Answer varies</strong>
             </div>`;

        // Add explanation if available
        const explanationHTML = question.answerExplanation && question.answerExplanation.trim()
          ? `<div class="explanation-section">
               <strong>Explanation:</strong> ${question.answerExplanation}
             </div>`
          : '';

        return `
          <div class="question">
            <div class="question-header">
              <span class="question-number">${index + 1}.</span>
              <span class="question-type">${question.questionType || 'MCQ'}</span>
              <span class="marks">(${question.marks || 1} mark${(question.marks || 1) > 1 ? 's' : ''})</span>
            </div>
            <div class="question-text">${questionText}</div>
            <div class="options-div">
              ${optionsHTML}
            </div>
            ${correctAnswerHTML}
            ${explanationHTML}
          </div>
        `;
      })
      .join("");
  };

  /**
   * Generate HTML with styling for answer sheet
   */
  const generateAnswerSheetHTMLWithStyling = (testPaper) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Answer Sheet - ${testPaper.testTitle || 'Test Paper'}</title>
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
            color: #007bff;
            font-size: 16px;
            margin-bottom: 4px;
            font-weight: bold;
          }
          
          .header .subtitle {
            color: #28a745;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 6px;
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
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
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
            margin: 0 0 20px 0;
            padding: 12px;          
            border: 2px solid #007bff;
            background-color: rgba(0, 123, 255, 0.05);
            position: relative;
            z-index: 2;
            page-break-inside: avoid;
            break-inside: avoid;
            min-height: 80px;
            border-radius: 6px;
          }
          
          .question-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #e8e8e8;
          }
          
          .question-number {
            font-weight: bold;
            color: #007bff;
            font-size: 11px;
          }
          
          .question-type {
            background-color: #007bff;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
          }
          
          .marks {
            background-color: #28a745;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
          }
          
          .question-text {
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            font-size: 10px;
            line-height: 1.3;
          }

          .content {
            padding-top: 8px;
          }
          
          .options-div {
            margin: 10px 0;
          }
          
          .option-row {
            display: flex;
            gap: 12px;
            margin-bottom: 6px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .option {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            background-color: #ffffff;
            min-height: 16px;
            display: flex;
            align-items: center;
            font-size: 9px;
            position: relative;
          }
          
          .option.correct-option {
            background-color: #e6f7ff;
            border: 2px solid #1890ff;
            font-weight: bold;
            color: #1890ff;
          }
          
          .option.single-option {
            max-width: 48%;
          }
          
          .option-letter {
            font-weight: bold;
            color: #007bff;
            margin-right: 6px;
            min-width: 14px;
            flex-shrink: 0;
            font-size: 9px;
          }
          
          .correct-mark {
            position: absolute;
            right: 6px;
            color: #28a745;
            font-weight: bold;
            font-size: 12px;
          }
          
          .correct-answer-section {
            margin: 10px 0 8px 0;
            padding: 8px;
            background-color: #e6f7ff;
            border: 1px solid #91d5ff;
            border-radius: 4px;
            color: #1890ff;
            font-size: 9px;
          }
          
          .explanation-section {
            margin: 8px 0 0 0;
            padding: 8px;
            background-color: #fff7e6;
            border: 1px solid #ffd591;
            border-radius: 4px;
            color: #fa8c16;
            font-size: 9px;
            line-height: 1.4;
          }
          
          .instructions {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
            page-break-inside: avoid;
            font-size: 9px;
            border-left: 4px solid #28a745;
          }
          
          .instructions h3 {
            margin-top: 0;
            margin-bottom: 8px;
            color: #28a745;
            font-size: 11px;
          }
          
          .instructions ul {
            margin-bottom: 0;
            padding-left: 16px;
          }
          
          .instructions li {
            margin-bottom: 3px;
            font-size: 8px;
            line-height: 1.3;
          }
          
          hr {
            border: 0;
            height: 2px;
            background: linear-gradient(to right, #007bff, #28a745);
            margin: 15px 0;
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
              margin-bottom: 15px;
            }
            
            .option-row {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            .instructions {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            .correct-answer-section,
            .explanation-section {
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
          <h1>ANSWER SHEET</h1>
          <div class="subtitle">${testPaper.testTitle || "Test Paper"}</div>
          <p>Complete solutions with correct answers and explanations</p>
        </div>
        
        <div class="info">
          <div class="info-left">
            <p><strong>Test Paper:</strong> ${testPaper.testTitle || "N/A"}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="info-right">
            <p><strong>Duration:</strong> ${testPaper.duration || "N/A"} minutes</p>
            <p><strong>Total Marks:</strong> ${testPaper.totalMarks || "N/A"}</p>
            <p><strong>Total Questions:</strong> ${processedQuestions.length || "N/A"}</p>
          </div>
        </div>
        
        <div class="instructions">
          <h3>Answer Sheet Guide:</h3>
          <ul>
            <li>✓ Correct answers are highlighted in blue</li>
            <li>✓ Each question shows the question type and marks</li>
            <li>✓ Explanations are provided where available</li>
            <li>✓ Use this sheet for review and preparation</li>
          </ul>
        </div>
        
        <hr>
        
        <div class="content">
          ${generateAnswerSheetHTML(processedQuestions)}
        </div>
        
        <div class="footer">
          <p>Answer Sheet generated by PJSofttech Pvt. Ltd. | ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
  };

  /**
   * Advanced PDF generation for answer sheet
   */
  const downloadAnswerSheetAsPDF = async (htmlContent, fileName) => {
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

  const handleDownloadAnswerSheet = async () => {
    if (!testPaper || !processedQuestions || processedQuestions.length === 0) {
      message.error('No data available for download');
      return;
    }

    setDownloadingPdf(true);
    
    try {
      message.loading({
        content: 'Generating answer sheet PDF...',
        key: 'pdf-generation',
        duration: 0,
      });

      // Generate HTML content
      const htmlContent = generateAnswerSheetHTMLWithStyling(testPaper);

      // Clean filename
      const cleanTitle = (testPaper.testTitle || "AnswerSheet")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 30);

      const fileName = `${cleanTitle}_AnswerSheet_${Date.now()}`;

      // Generate and download PDF
      await downloadAnswerSheetAsPDF(htmlContent, fileName);

      message.success({
        content: 'Answer sheet PDF downloaded successfully!',
        key: 'pdf-generation',
        duration: 3,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.error({
        content: `Failed to generate PDF: ${error.message}`,
        key: 'pdf-generation',
        duration: 4,
      });
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          <span>Answer Sheet - {testPaper?.testTitle}</span>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button
          key="download"
          type="primary"
          icon={<FilePdfOutlined />}
          onClick={handleDownloadAnswerSheet}
          loading={downloadingPdf}
          disabled={!processedQuestions || processedQuestions.length === 0}
          style={{ marginRight: 8 }}
        >
          {downloadingPdf ? 'Generating PDF...' : 'Download Answer Sheet'}
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Close
        </Button>
      ]}
      bodyStyle={{ maxHeight: '600px', overflowY: 'auto' }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading questions...</div>
        </div>
      ) : (
        <>
          {testPaper && (
            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f8f9fa' }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>Total Questions:</Text> {processedQuestions?.length || 0}
                </Col>
                <Col span={8}>
                  <Text strong>Total Marks:</Text> {testPaper.totalMarks || 'N/A'}
                </Col>
                <Col span={8}>
                  <Text strong>Duration:</Text> {testPaper.duration || 'N/A'} mins
                </Col>
              </Row>
            </Card>
          )}

          {processedQuestions && processedQuestions.length > 0 ? (
            <div>
              {processedQuestions.map((question, index) => (
                <Card
                  key={question.id || index}
                  size="small"
                  style={{ marginBottom: 16 }}
                  title={
                    <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                      Question {index + 1} - {question.questionType} ({question.marks} mark{question.marks > 1 ? 's' : ''})
                    </span>
                  }
                >
                  <div style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      {question.questionText || 'Question text not available'}
                    </Text>
                  </div>

                  {question.options && question.options.length > 0 && question.questionType === 'MCQ' && (
                    <div style={{ marginBottom: 12 }}>
                      <Text strong style={{ color: '#666', fontSize: '12px' }}>OPTIONS:</Text>
                      <div style={{ marginLeft: 16, marginTop: 4 }}>
                        {question.options.map((option, optIndex) => {
                          const optionLetter = String.fromCharCode(65 + optIndex);
                          const isCorrect = question.correctanswer === optionLetter;
                          
                          return (
                            <div
                              key={optIndex}
                              style={{
                                padding: '4px 8px',
                                marginBottom: '4px',
                                backgroundColor: isCorrect ? '#f6ffed' : '#fafafa',
                                border: isCorrect ? '1px solid #b7eb8f' : '1px solid #d9d9d9',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                              }}
                            >
                              {isCorrect && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                              <Text style={{ 
                                color: isCorrect ? '#52c41a' : '#666',
                                fontWeight: isCorrect ? 'bold' : 'normal'
                              }}>
                                {optionLetter}. {option}
                              </Text>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#e6f7ff',
                    border: '1px solid #91d5ff',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <CheckCircleOutlined style={{ color: '#1890ff' }} />
                    <Text strong style={{ color: '#1890ff' }}>
                      {question.questionType === 'MCQ' 
                        ? `Correct Answer: ${question.correctanswer || 'Not specified'}`
                        : 'Descriptive Question - Answer varies'
                      }
                    </Text>
                  </div>

                  {question.answerExplanation && question.answerExplanation.trim() && (
                    <div style={{
                      marginTop: 8,
                      padding: '8px 12px',
                      backgroundColor: '#fff7e6',
                      border: '1px solid #ffd591',
                      borderRadius: '4px'
                    }}>
                      <Text strong style={{ color: '#fa8c16' }}>Explanation: </Text>
                      <Text style={{ color: '#595959' }}>{question.answerExplanation}</Text>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
              <Text>No questions available for this test paper</Text>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default AnswerSheetModal;