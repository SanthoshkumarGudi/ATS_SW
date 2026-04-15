// src/pages/InterviewAnalytics.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  People,
  AccessTime,
  CheckCircle,
  Cancel,
  Search as SearchIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InterviewAnalytics() {
  const [stats, setStats] = useState({
    totalInterviews: 0,
    upcoming: 0,
    scheduled: 0,
    completed: 0,
    canceled: 0,
    avgRating: 0,
  });

  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeFilter, setActiveFilter] = useState("total");
  const [showDetails, setShowDetails] = useState(false);
  const [showCharts, setShowCharts] = useState(false);   // New: Charts toggle

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/api/interviews`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = Array.isArray(response.data) ? response.data : [];
        setInterviews(data);

        const total = data.length;
        const upcoming = data.filter(
          (i) => i.status === "scheduled" && new Date(i.scheduledAt) > new Date()
        ).length;

        const completed = data.filter((i) =>
          ["offered", "on-hold", "rejected"].includes(i.application?.status)
        ).length;

        const canceled = data.filter(
          (i) =>
            i.application?.status === "rejected" ||
            i.status === "canceled" ||
            i.status === "cancelled"
        ).length;

        const scheduled = total - completed - canceled;

        const rated = data.filter((i) => typeof i.feedback?.rating === "number");
        const avgRating = rated.length > 0
          ? (rated.reduce((sum, i) => sum + i.feedback.rating, 0) / rated.length).toFixed(1)
          : 0;

        setStats({
          totalInterviews: total,
          upcoming,
          scheduled,
          completed,
          canceled,
          avgRating: parseFloat(avgRating),
        });
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setError("Failed to load interview analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, []);

  // Filter logic
  const applyFilters = useMemo(() => {
    let result = [...interviews];

    if (activeFilter === "upcoming") {
      result = result.filter(
        (i) => i.status === "scheduled" && new Date(i.scheduledAt) > new Date()
      );
    } else if (activeFilter === "completed") {
      result = result.filter((i) =>
        ["offered", "on-hold", "rejected"].includes(i.application?.status)
      );
    } else if (activeFilter === "canceled") {
      result = result.filter(
        (i) =>
          i.application?.status === "rejected" ||
          i.status === "canceled" ||
          i.status === "cancelled"
      );
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((i) => {
        const name = i.application?.parsedData?.name?.toLowerCase() || "";
        const job = i.application?.job?.title?.toLowerCase() || "";
        return name.includes(term) || job.includes(term);
      });
    }

    // Date Range Filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter((i) => {
        if (!i.scheduledAt) return false;
        const interviewDate = new Date(i.scheduledAt);
        return interviewDate >= start && interviewDate <= end;
      });
    }

    return result;
  }, [interviews, activeFilter, searchTerm, startDate, endDate]);

  useEffect(() => {
    setFilteredInterviews(applyFilters);
  }, [applyFilters]);

  const showIntDetails = (param) => {
    setActiveFilter(param);
    setShowDetails(true);
    setShowCharts(false);           // Reset charts when changing filter
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
  };

  const handleViewDetails = (interview) => setSelectedInterview(interview);
  const closeModal = () => setSelectedInterview(null);

  // Chart Data
  const ratingDistribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    interviews.forEach((i) => {
      if (i.feedback?.rating) {
        const r = Math.floor(i.feedback.rating);
        if (r >= 1 && r <= 5) counts[r - 1]++;
      }
    });
    return counts.map((value, index) => ({ label: `${index + 1}★`, value }));
  }, [interviews]);

  const statusData = useMemo(() => {
    const completedCount = interviews.filter((i) =>
      ["offered", "on-hold", "rejected"].includes(i.application?.status)
    ).length;
    const canceledCount = interviews.filter((i) =>
      i.application?.status === "rejected" ||
      i.status === "canceled" ||
      i.status === "cancelled"
    ).length;
    const scheduledCount = interviews.length;
    const upcomingCount = interviews.filter(
      (i) => i.status === "scheduled" && new Date(i.scheduledAt) > new Date()
    ).length;

    return [
      { id: 0, value: scheduledCount, label: "Scheduled", color: "#ed6c02" },
      { id: 1, value: completedCount, label: "Completed", color: "#2e7d32" },
      { id: 2, value: canceledCount, label: "Canceled", color: "#d32f2f" },
      {id :3, value: upcomingCount, label: "Upcoming", color: "#1976d2" },
    ];
  }, [interviews]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress size={70} />
        <Typography sx={{ mt: 3 }}>Loading Interview Analytics...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Interview Analytics
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { label: "Total Interviews", value: stats.totalInterviews, icon: People, color: "#1976d2", param: "total" },
            { label: "Upcoming", value: stats.upcoming, icon: AccessTime, color: "#ed6c02", param: "upcoming" },
            { label: "Completed", value: stats.completed, icon: CheckCircle, color: "#2e7d32", param: "completed" },
            { label: "Canceled", value: stats.canceled, icon: Cancel, color: "#d32f2f", param: "canceled" },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.param}>
              <Card
                sx={{ height: "100%", cursor: "pointer" }}
                onClick={() => showIntDetails(item.param)}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <item.icon sx={{ fontSize: 45, color: item.color }} />
                    <Box>
                      <Typography variant="h3" fontWeight="bold">{item.value}</Typography>
                      <Typography color="text.secondary">{item.label}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Details Section */}
        {showDetails && (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {activeFilter === "total"
                ? "All Interviews"
                : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Interviews`}
            </Typography>

            {/* Filters */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mb: 3 }}
              alignItems="center"
            >
              <TextField
                fullWidth
                placeholder="Search by candidate or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />

              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { size: "small" } }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { size: "small" } }}
              />

              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm("");
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                Clear
              </Button>
            </Stack>

            {/* Toggleable Charts */}
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Visual Analytics
                </Typography>
                <Button
                  variant="contained"
                  color={showCharts ? "secondary" : "primary"}
                  onClick={() => setShowCharts(!showCharts)}
                >
                  {showCharts ? "Hide Charts" : "Show Charts"}
                </Button>
              </Stack>

              {showCharts && (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6} alignContent="center">
                    <Paper sx={{ p: 3, minHeight: 460 }}>
                      <Typography variant="h6" gutterBottom>
                        Interview Status Breakdown
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
                        <PieChart
                          series={[
                            {
                              data: statusData,
                              innerRadius: 75,
                              outerRadius: 160,
                              paddingAngle: 4,
                              arcLabel: (item) => (item.value > 0 ? item.value : ""),
                            },
                          ]}
                          height={400}
                          width={400}
                          slotProps={{
                            legend: {
                              direction: "column",
                              position: { vertical: "middle", horizontal: "right" },
                              markGap: 10,
                              itemGap: 15,
                            },
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </Box>

            {/* Interview Details Table */}
            <Paper sx={{ overflow: "auto", maxHeight: 600 }}>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Candidate</strong></TableCell>
                      <TableCell><strong>Job Title</strong></TableCell>
                      <TableCell><strong>Interviewer</strong></TableCell>
                      <TableCell><strong>Scheduled At</strong></TableCell>
                      <TableCell><strong>Duration (min)</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Rating</strong></TableCell>
                      <TableCell><strong>Recommendation</strong></TableCell>
                      <TableCell><strong>Feedback Summary</strong></TableCell>
                      <TableCell align="center"><strong>Action</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInterviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          No interviews found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInterviews.map((intv) => (
                        <TableRow key={intv._id} hover>
                          <TableCell>{intv.application?.parsedData?.name || "N/A"}</TableCell>
                          <TableCell>{intv.application?.job?.title || "N/A"}</TableCell>
                          <TableCell>{intv.interviewer?.name || "N/A"}</TableCell>
                          <TableCell>
                            {intv.scheduledAt ? new Date(intv.scheduledAt).toLocaleString() : "N/A"}
                          </TableCell>
                          <TableCell>{intv.duration || "—"}</TableCell>
                          <TableCell>{intv.application?.status || intv.status}</TableCell>
                          <TableCell>{intv.feedback?.rating || "—"}</TableCell>
                          <TableCell>{intv.feedback?.recommendation || "—"}</TableCell>
                          <TableCell>
                            {(intv.feedback?.comments || intv.feedback?.summary || "").substring(0, 65)}
                            {(intv.feedback?.comments || intv.feedback?.summary || "").length > 65 ? "..." : ""}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewDetails(intv)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

      {/* View Details Modal - Improved Version */}
<Dialog 
  open={!!selectedInterview} 
  onClose={closeModal} 
  maxWidth="md" 
  fullWidth
>
  <DialogTitle sx={{ pb: 1 }}>
    Interview Details
  </DialogTitle>

  <DialogContent dividers>
    {selectedInterview && (
      <Stack spacing={4}>
        {/* Candidate & Job Info */}
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {selectedInterview.application?.parsedData?.name || "Unknown Candidate"}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {selectedInterview.application?.job?.title || "N/A"} • 
            Interviewer: {selectedInterview.interviewer?.name || "N/A"}
          </Typography>
        </Box>

        {/* Basic Information */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            BASIC INFORMATION
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Scheduled At</Typography>
              <Typography variant="body1">
                {selectedInterview.scheduledAt 
                  ? new Date(selectedInterview.scheduledAt).toLocaleString() 
                  : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Duration</Typography>
              <Typography variant="body1">
                {selectedInterview.duration ? `${selectedInterview.duration} minutes` : "—"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              <Typography variant="body1">
                {selectedInterview.application?.status || selectedInterview.status || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Rating</Typography>
              <Typography variant="h5" color="primary" fontWeight="medium">
                {selectedInterview.feedback?.rating ? `${selectedInterview.feedback.rating} / 5` : "—"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Recommendation */}
        {selectedInterview.feedback?.recommendation && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              RECOMMENDATION
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 500,
                color: selectedInterview.feedback.recommendation.toLowerCase().includes("hire") 
                  ? "success.main" 
                  : "text.primary"
              }}
            >
              {selectedInterview.feedback.recommendation}
            </Typography>
          </Box>
        )}

        {/* Feedback Section */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            FEEDBACK & COMMENTS
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 3, bgcolor: "grey.50" }}>
            <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
              {selectedInterview.feedback?.comments ||
               selectedInterview.feedback?.notes ||
               selectedInterview.feedback?.summary ||
               "No detailed feedback provided yet."}
            </Typography>
          </Paper>

          {/* Feedback Metadata */}
          {selectedInterview.feedback && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "block" }}>
              Feedback submitted by {selectedInterview.interviewer?.name || "Interviewer"} • 
              {selectedInterview.feedback?.createdAt 
                ? new Date(selectedInterview.feedback.createdAt).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) 
                : new Date(selectedInterview.scheduledAt || Date.now()).toLocaleDateString('en-IN')}
            </Typography>
          )}
        </Box>
      </Stack>
    )}
  </DialogContent>

  <DialogActions sx={{ px: 3, py: 2 }}>
    <Button 
      onClick={closeModal} 
      variant="contained" 
      color="primary"
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
      </Container>
    </LocalizationProvider>
  );
}