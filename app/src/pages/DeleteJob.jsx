// // frontend/src/pages/EditJob.jsx
// import { useEffect, useState } from "react";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Alert,
//   IconButton,
//   FormControlLabel,
//   Checkbox,
//   Divider,
//   LinearProgress,
//   MenuItem,
// } from "@mui/material";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import Tiptap from "./TipTap";
// import GoBackButton from "../GoBack";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs from "dayjs";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


// export default function DeleteJob()  {



//     return (
//         <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
//             <Typography variant="h4" color="error" gutterBottom>
//                 Job Deleted Successfully
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//                 The job has been deleted. You will be redirected to the job listings page shortly.
//             </Typography>
//         </Container>
//     );
// }