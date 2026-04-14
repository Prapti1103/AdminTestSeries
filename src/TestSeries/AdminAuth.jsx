




// import React, { useState } from "react";
// import axios from "axios";
// import { Button, TextField, Paper, Typography, Stack } from "@mui/material";

// const AdminAuth = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phoneNo: "",
//     password: "",
//     confirmPassword: "",
//     newPassword: "",
//   });
//   const [action, setAction] = useState("login");
//   const [message, setMessage] = useState("");

//   // Handle Input Change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle Form Submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation: Check if passwords match for registration
//     if (action === "register" && formData.password !== formData.confirmPassword) {
//       setMessage("Passwords do not match!");
//       return;
//     }

//     try {
//       let url = `http://localhost:8101/admin/${action}`;
//       let requestData = {};

//       if (action === "login") {
//         // Send email & password as query params for login
//         url += `?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`;
//       } else if (action === "forgotpassword") {
//         // Send email & newPassword as query params for forgot password
//         url += `?email=${encodeURIComponent(formData.email)}&newPassword=${encodeURIComponent(formData.newPassword)}`;
//       } else {
//         // Register: Send data as JSON
//         requestData = {
//           name: formData.name,
//           email: formData.email,
//           phoneNo: formData.phoneNo.toString(),
//           password: formData.password,
//           confirmPassword: formData.confirmPassword,
//         };
//       }

//       console.log("Sending request to:", url, "with data:", requestData);

//       const response =
//         action === "register"
//           ? await axios.post(url, requestData, { headers: { "Content-Type": "application/json" } })
//           : await axios.post(url);

//       if (response.status === 200) {
//         setMessage(response.data.message || "Success!");

//         // If login is successful, call onLogin() to switch to Sidebar
//         if (action === "login") {
//           onLogin();
//         }

//         // Clear form after successful submission
//         setFormData({
//           name: "",
//           email: "",
//           phoneNo: "",
//           password: "",
//           confirmPassword: "",
//           newPassword: "",
//         });
//       } else {
//         setMessage("Invalid credentials");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setMessage("Error: " + (error.response?.data?.message || "Something went wrong"));
//     }
//   };

//   return (
//     <Paper elevation={4} sx={{ maxWidth: 400, mx: "auto", p: 3, mt: 5, borderRadius:5 }}>
//       <Typography variant="h5" textAlign="center" mb={2}>
//         Admin {action.charAt(0).toUpperCase() + action.slice(1)}
//       </Typography>

//       {/* Action Selection Buttons */}
//       <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
//         <Button variant={action === "register" ? "contained" : "outlined"} onClick={() => setAction("register")}>
//           Register
//         </Button>
//         <Button variant={action === "login" ? "contained" : "outlined"} onClick={() => setAction("login")}>
//           Login
//         </Button>
//         <Button variant={action === "forgotpassword" ? "contained" : "outlined"} onClick={() => setAction("forgotpassword")}>
//           Forgot Password
//         </Button>
//       </Stack>

//       {/* Form */}
//       <form onSubmit={handleSubmit}>
//         {action === "register" && (
//           <>
//             <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
//             <TextField label="Phone Number" name="phoneNo" value={formData.phoneNo} onChange={handleChange} fullWidth margin="normal" required />
//           </>
//         )}
//         <TextField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required />

//         {(action === "register" || action === "login") && (
//           <TextField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" required />
//         )}
//         {action === "register" && (
//           <TextField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} fullWidth margin="normal" required />
//         )}
//         {action === "forgotpassword" && (
//           <TextField label="New Password" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} fullWidth margin="normal" required />
//         )}

//         <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
//           Submit
//         </Button>
//       </form>

//       {message && (
//         <Typography color={message.includes("Error") ? "error" : "success"} textAlign="center" mt={2}>
//           {message}
//         </Typography>
//       )}
//     </Paper>
//   );
// };

// export default AdminAuth;



// import React, { useState } from "react";
// import axios from "axios";
// import {
//   Button,
//   TextField,
//   Typography,
//   Stack,
//   Paper,
//   Box,
//   Checkbox,
//   FormControlLabel,
// } from "@mui/material";

// const AdminAuth = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phoneNo: "",
//     password: "",
//     confirmPassword: "",
//     newPassword: "",
//   });
//   const [action, setAction] = useState("login");
//   const [message, setMessage] = useState("");

//   // Handle Input Change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle Form Submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (action === "register" && formData.password !== formData.confirmPassword) {
//       setMessage("Passwords do not match!");
//       return;
//     }

//     try {
//       let url = `http://localhost:8101/admin/${action}`;
//       let requestData = {};

//       if (action === "login") {
//         url += `?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(
//           formData.password
//         )}`;
//       } else if (action === "forgotpassword") {
//         url += `?email=${encodeURIComponent(formData.email)}&newPassword=${encodeURIComponent(
//           formData.newPassword
//         )}`;
//       } else {
//         requestData = {
//           name: formData.name,
//           email: formData.email,
//           phoneNo: formData.phoneNo.toString(),
//           password: formData.password,
//           confirmPassword: formData.confirmPassword,
//         };
//       }

//       const response =
//         action === "register"
//           ? await axios.post(url, requestData, { headers: { "Content-Type": "application/json" } })
//           : await axios.post(url);

//       if (response.status === 200) {
//         setMessage(response.data.message || "Success!");
//         if (action === "login") {
//           onLogin();
//         }
//         setFormData({
//           name: "",
//           email: "",
//           phoneNo: "",
//           password: "",
//           confirmPassword: "",
//           newPassword: "",
//         });
//       } else {
//         setMessage("Invalid credentials");
//       }
//     } catch (error) {
//       setMessage("Error: " + (error.response?.data?.message || "Something went wrong"));
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "linear-gradient(to bottom right,rgb(239, 236, 242), #2575fc)",
//       }}
//     >
//       <Paper
//         elevation={8}
//         sx={{
//           width: 380,
//           backdropFilter: "blur(12px)",
//           backgroundColor: "rgba(255, 255, 255, 0.1)",
//           padding: 4,
//           borderRadius: 5,
//           textAlign: "center",
//           boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <Typography variant="h5" fontWeight="bold" color="white" mb={2}>
//           Admin {action.charAt(0).toUpperCase() + action.slice(1)}
//         </Typography>

//         {/* Action Buttons */}
//         <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
//           <Button variant={action === "register" ? "contained" : "outlined"} onClick={() => setAction("register")}>
//             Register
//           </Button>
//           <Button variant={action === "login" ? "contained" : "outlined"} onClick={() => setAction("login")}>
//             Login
//           </Button>
//           <Button variant={action === "forgotpassword" ? "contained" : "outlined"} onClick={() => setAction("forgotpassword")}>
//             Forgot Password
//           </Button>
//         </Stack>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           {action === "register" && (
//             <>
//               <TextField
//                 label="Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 fullWidth
//                 variant="outlined"
//                 sx={{ mb: 2, input: { color: "white" } }}
//               />
//               <TextField
//                 label="Phone Number"
//                 name="phoneNo"
//                 value={formData.phoneNo}
//                 onChange={handleChange}
//                 fullWidth
//                 variant="outlined"
//                 sx={{ mb: 2, input: { color: "white" } }}
//               />
//             </>
//           )}

//           <TextField
//             label="Email"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             fullWidth
//             variant="outlined"
//             sx={{ mb: 2, input: { color: "white" } }}
//           />

//           {(action === "register" || action === "login") && (
//             <TextField
//               label="Password"
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//               sx={{ mb: 2, input: { color: "white" } }}
//             />
//           )}

//           {action === "register" && (
//             <TextField
//               label="Confirm Password"
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//               sx={{ mb: 2, input: { color: "white" } }}
//             />
//           )}

//           {action === "forgotpassword" && (
//             <TextField
//               label="New Password"
//               type="password"
//               name="newPassword"
//               value={formData.newPassword}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//               sx={{ mb: 2, input: { color: "white" } }}
//             />
//           )}

//           {action === "login" && (
//             <FormControlLabel control={<Checkbox sx={{ color: "white" }} />} label="Remember me" sx={{ color: "white" }} />
//           )}

//           <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "#ff4081" }}>
//             Submit
//           </Button>
//         </form>

//         {message && (
//           <Typography color={message.includes("Error") ? "error" : "success"} textAlign="center" mt={2}>
//             {message}
//           </Typography>
//         )}

//         <Typography mt={2} color="white">
//           Don't have an account?{" "}
//           <span style={{ color: "gold", cursor: "pointer" }} onClick={() => setAction("register")}>
//             Register
//           </span>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// };

// export default AdminAuth;







import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  Checkbox,
  FormControlLabel,
  Link,
} from "antd";

const AdminAuth = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
  });
  const [action, setAction] = useState("login");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (action === "register" && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      let url = `http://localhost:8101/admin/${action}`;
      let requestData = {};

      if (action === "login") {
        url += `?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`;
      } else if (action === "forgotpassword") {
        url += `?email=${encodeURIComponent(formData.email)}&newPassword=${encodeURIComponent(formData.newPassword)}`;
      } else {
        requestData = {
          name: formData.name,
          email: formData.email,
          phoneNo: formData.phoneNo.toString(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };
      }

      const response =
        action === "register"
          ? await axios.post(url, requestData, { headers: { "Content-Type": "application/json" } })
          : await axios.post(url);

      if (response.status === 200) {
        setMessage(response.data.message || "Success!");
        if (action === "login") {
          onLogin();
        }
        setFormData({
          name: "",
          email: "",
          phoneNo: "",
          password: "",
          confirmPassword: "",
          newPassword: "",
        });
      } else {
        setMessage("Invalid credentials");
      }
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "skyblue",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "#fff",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
          {action === "register"
            ? "Admin Register"
            : action === "forgotpassword"
            ? "Admin Forgot Password"
            : "Admin Login"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {action === "register" && (
            <>
              <TextField
                label="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                variant="standard"
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <TextField
                label="Enter your phone number"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                variant="standard"
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
            </>
          )}

          <TextField
            label="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="standard"
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{ style: { color: "#fff" } }}
          />

          {(action === "register" || action === "login") && (
            <TextField
              label="Enter your password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              variant="standard"
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
          )}

          {action === "register" && (
            <TextField
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              variant="standard"
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
          )}

          {action === "forgotpassword" && (
            <TextField
              label="Enter new password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              variant="standard"
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
            />
          )}

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            {action === "login" && (
              <FormControlLabel
                control={<Checkbox sx={{ color: "#fff" }} />}
                label={<Typography color="#fff">Remember me</Typography>}
              />
            )}
            <Link
              underline="hover"
              sx={{ color: "#fff", cursor: "pointer" }}
              onClick={() => setAction("forgotpassword")}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, backgroundColor: "#fff", color: "#000" }}
          >
            {action === "register"
              ? "Register"
              : action === "forgotpassword"
              ? "Reset Password"
              : "Log In"}
          </Button>

          <Typography mt={2}>
            {action === "login" ? (
              <>
                <span>Don't have an admin account?</span>{" "}
                <Link underline="hover" sx={{ color: "#fff", cursor: "pointer" }} onClick={() => setAction("register")}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <span>Already have an admin account?</span>{" "}
                <Link underline="hover" sx={{ color: "#fff", cursor: "pointer" }} onClick={() => setAction("login")}>
                  Login
                </Link>
              </>
            )}
          </Typography>
        </form>

        {message && (
          <Typography mt={2} color={message.includes("Error") ? "error.main" : "success.main"}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AdminAuth;
