import { useForm } from "react-hook-form";

// import 'react-quill/dist/quill.snow.css';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Tiptap from "./TipTap";
import GoBackButton from "../GoBack";

export default function CreateJob() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();
  const description = watch("description");

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/jobs", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/");
    } catch (err) {
      alert("Error creating job");
    }
  };

  return (
    <Container maxWidth="md">
      {/* <GoBackButton/> */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Job
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Job Title"
            {...register("title")}
            margin="normal"
            required
          />

          {/* <TextField variant="subtitle1" sx={{ mt: 2 }}>Description</TextField> */}

          <Typography
            variant="subtitle1"
            sx={{ mt: 3, mb: 1, fontWeight: 600 }}
          >
            Job Description
          </Typography>
          <Tiptap
            value={description || ""}
            onChange={(v) => setValue("description", v)}
          />
          {/* Hidden input to make react-hook-form happy */}
          <input
            type="hidden"
            {...register("description", { required: true })}
          />
          <TextField
            fullWidth
            label="Skills (comma separated)"
            {...register("skills")}
            margin="normal"
            helperText="e.g. React, Node.js, MongoDB"
          />

          {/* <TextField select fullWidth label="Clearance Level" {...register('clearanceLevel')} margin="normal" defaultValue="None">
              {['None', 'Confidential', 'Secret', 'Top Secret'].map((lvl) => (
                <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
              ))}
            </TextField> */}

          <TextField
            fullWidth
            label="Department"
            {...register("department")}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            {...register("location")}
            margin="normal"
          />

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" size="large">
              Create Job Posting
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
