// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   div,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Tablediv,
//   Paper,
//   Button,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// const SolvedTestPaper = () => {
//   const [users, setUsers] = useState([]);
//   const [solvedPapers, setSolvedPapers] = useState([]);
//   const [paperDetails, setPaperDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [loadingPapers, setLoadingPapers] = useState(false);
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedTestPaper, setSelectedTestPaper] = useState(null);

//   // Fetch all users
//   useEffect(() => {
//     axios
//       .get("http://localhost:8101/user/getAllUsers")
//       .then((response) => {
//         setUsers(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error.message);
//         setLoading(false);
//       });
//   }, []);

//   // Fetch solved test papers for the selected user
//   const handleViewClick = (userId) => {
//     setLoadingPapers(true);
//     setSelectedUser(userId);
//     setError(null);

//     axios
//       .get(`http://localhost:8101/getallsolvedpaper/${userId}`)
//       .then((response) => {
//         setSolvedPapers(response.data);
//         setLoadingPapers(false);
//       })
//       .catch((error) => {
//         setError(error.message);
//         setLoadingPapers(false);
//       });
//   };

//   // Fetch solved test paper details for a specific test paper
//   const handleViewPaperClick = (testPaperId) => {
//     if (!selectedUser || !testPaperId) {
//       console.error("Error: selectedUser or testPaperId is undefined!");
//       return;
//     }

//     setLoadingDetails(true);
//     setSelectedTestPaper(testPaperId);
//     setError(null);

//     axios
//       .get(`http://localhost:8101/solved/${selectedUser}/${testPaperId}`)
//       .then((response) => {
//         setPaperDetails(response.data);
//         setLoadingDetails(false);
//       })
//       .catch((error) => {
//         setError(error.message);
//         setLoadingDetails(false);
//       });
//   };

//   // Go back to solved papers list
//   const handleBackToPapers = () => {
//     setSelectedTestPaper(null);
//     setPaperDetails(null);
//   };

//   // Go back to users list
//   const handleBackToUsers = () => {
//     setSelectedUser(null);
//     setSolvedPapers([]);
//     setSelectedTestPaper(null);
//     setPaperDetails(null);
//     setError(null);
//   };

//   return (
//     <div maxWidth="xl" sx={{ height: "100%", width: "1400px", mt: 0 }}>
//       {/* Show test paper details if a test paper is selected */}
//       {selectedTestPaper ? (
//         <div>
//           <Typography variant="h5" gutterBottom>
//             Solved Test Paper Details
//           </Typography>
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={handleBackToPapers}
//             sx={{ mb: 2 }}
//           >
//             Back
//           </Button>

//           {loadingDetails ? (
//             <CircularProgress />
//           ) : error ? (
//             <Typography color="error">Error: {error}</Typography>
//           ) : paperDetails ? (
//             <Tablediv component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>
//                       <strong>Question</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Your Answer</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Correct Answer</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Score</strong>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {paperDetails.answers?.map((answer, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{answer.questionText}</TableCell>
//                       <TableCell>{answer.givenAnswer}</TableCell>
//                       <TableCell>
//                         {answer.isCorrect ? "✔ Correct" : "✘ Incorrect"}
//                       </TableCell>
//                       <TableCell>{answer.isCorrect ? 1 : 0}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Tablediv>
//           ) : (
//             <Typography>No data found for this solved paper.</Typography>
//           )}
//         </div>
//       ) : selectedUser ? (
//         // Show solved test papers if a user is selected
//         <div>
//           <Typography variant="h5" gutterBottom>
//             Solved Test Papers for User {selectedUser}
//           </Typography>
//           <Button
//             variant="contained"
//             bgcolor="0086B9"
//             onClick={handleBackToUsers}
//             sx={{ mb: 2 }}
//           >
//             Back
//           </Button>

//           {loadingPapers ? (
//             <CircularProgress />
//           ) : error ? (
//             <Typography color="error">Error: {error}</Typography>
//           ) : solvedPapers.length > 0 ? (
//             <Tablediv component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                     <TableCell>
//                       <strong>Id</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Test Name</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Score</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Correct</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Incorrect</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Solved</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Unsolved</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Attempt Number</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>View</strong>
//                     </TableCell>

//                     {/* <TableCell><strong>Actions</strong></TableCell> */}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {solvedPapers.map((paper, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{paper.testPaperId}</TableCell>
//                       <TableCell>{paper.testTitle}</TableCell>
//                       <TableCell>{paper.totalScore}</TableCell>
//                       <TableCell>{paper.correctQuestions}</TableCell>
//                       <TableCell>{paper.incorrectQuestions}</TableCell>
//                       <TableCell>{paper.solvedQuestions}</TableCell>
//                       <TableCell>{paper.unsolvedQuestions}</TableCell>
//                       <TableCell>{paper.attemptNumber}</TableCell>

//                       <TableCell>
//                         <Button
//                           onClick={() =>
//                             handleViewPaperClick(paper.testPaperId)
//                           }
//                           variant="text"
//                           sx={{ ml: 1, color: "#0086B9" }}
//                         >
//                           <VisibilityIcon />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Tablediv>
//           ) : (
//             <Typography color="textSecondary">
//               No solved test papers found.
//             </Typography>
//           )}
//         </div>
//       ) : (
//         // Show list of users
//         <div>
//           {loading ? (
//             <CircularProgress />
//           ) : error ? (
//             <Typography color="error">Error: {error}</Typography>
//           ) : (
//             <Tablediv
//               component={Paper}
//               sx={{ marginTop: 1, borderRadius: 5 }}
//             >
//               <Table>
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                     <TableCell>
//                       <strong>User ID</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Username</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Mail</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Phone No</strong>
//                     </TableCell>
//                     <TableCell>
//                       <strong>Actions</strong>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {users.map((user) => (
//                     <TableRow key={user.id}>
//                       <TableCell>{user.id}</TableCell>
//                       <TableCell>{user.name}</TableCell>
//                       <TableCell>{user.email}</TableCell>
//                       <TableCell>{user.phoneNo}</TableCell>
//                       <TableCell>
//                         <Button
//                           onClick={() => handleViewClick(user.id)}
//                           variant="text"
//                           sx={{ ml: 1, color: "#0086B9" }}
//                         >
//                           <VisibilityIcon />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Tablediv>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SolvedTestPaper;

import React, { useEffect, useState } from "react";
import { Button, Table, Typography, Input, Row, Col, Select } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllUsers } from "../API/AllApi.js";
import { useNavigate } from "react-router-dom";

const SolvedTestPaper = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const navigate = useNavigate();

  const [pageSize, setPageSize] = useState(1000);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.userName.toLowerCase().includes(searchName.toLowerCase()) &&
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchName, searchEmail, users]);

  const columns = [
    {
      title: "Sr No",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact No",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <Button
          icon={<EyeOutlined />}
          style={{ fontSize: "18px", color: "#1890ff", cursor: "pointer" }}
          onClick={() =>
            navigate(`/ebooklayout/test-series-manager/solved-paper/${user.id}`)
          }
        />
      ),
    },
  ];

  return (
    <>
      <Typography.Title level={3}>User Solved Test Papers</Typography.Title>

      <Row gutter={16} style={{ marginBottom: 12 }}>
        <Col span={6}>
          <Input
            placeholder="Search by Name"
            prefix={<SearchOutlined />}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            allowClear
          />
        </Col>
        <Col span={6}>
          <Input
            placeholder="Search by Email"
            prefix={<SearchOutlined />}
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            allowClear
          />
        </Col>
        <Col span={12} style={{ textAlign: "right", paddingTop: 4 }}>
          <Typography.Text type="secondary">
            Total: {filteredUsers.length}
          </Typography.Text>
        </Col>
      </Row>

      <Table
        size="small"
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <div style={{ textAlign: "left", marginBottom: 10 }}>
        <span style={{ fontSize: "13px", color: "#666", marginRight: 8 }}>
          Rows per page:
        </span>
        <Select
          value={pageSize}
          onChange={(value) => {
            setPageSize(value);
            setCurrentPage(1);
          }}
          style={{ width: 80 }}
        >
          <Select.Option value={1000}>1000</Select.Option>
          <Select.Option value={5000}>5000</Select.Option>
          <Select.Option value={10000}>10000</Select.Option>
        </Select>
      </div>
    </>
  );
};

export default SolvedTestPaper;
