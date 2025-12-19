// frontend/src/components/MyProfileModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  AccountCircle,
  LocationOn,
  Work,
  Timer,
  Code,
  TrendingUp,
  Edit,
  Map,
  CalendarToday,
  Star,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MyProfileModal({ open, onClose, profile }) {
  const { user } = useAuth();

  const navigate = useNavigate();

  if (!profile) return null;

  const handleEdit = () => {
    onClose();
    navigate("/profile/edit");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        },
      }}
    >
      {/* Elegant Header */}
      <DialogTitle
        sx={{
          bgcolor: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          color: "white",
          py: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ mb: 0.5 }}>
              My Profile
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Keep your profile updated for better job matches
            </Typography>
          </Box>

          {user.role === "candidate" && (
            <Button
              variant="contained"
              size="medium"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{
                bgcolor: "rgba(255,255,255,0.25)",
                color: "black",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 3,
                px: 3,
                py: 1.5,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.35)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 6, px: { xs: 3, sm: 6 } }}>
        <Stack spacing={5}>
          {/* Avatar + Name Section */}
          <Box display="flex" alignItems="center" gap={4}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#e0e7ff",
                color: "#4f46e5",
                fontSize: 48,
                fontWeight: "bold",
                border: "6px solid white",
                boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="800" color="#1e293b">
                {profile.name}
              </Typography>
              <Typography
                variant="h6"
                color="#6366f1"
                fontWeight="600"
                sx={{ mt: 1 }}
              >
                {profile.targetJobTitle || "Looking for opportunities"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "#e2e8f0", my: 2 }} />

          {/* Location Info */}
          <Stack spacing={4}>
            <Box display="flex" alignItems="flex-start" gap={3}>
              <Box
                sx={{
                  bgcolor: "#f0f9ff",
                  p: 1.5,
                  borderRadius: 3,
                  boxShadow: "0 4px 15px rgba(14, 165, 233, 0.15)",
                }}
              >
                <LocationOn sx={{ color: "#0ea5e9", fontSize: 32 }} />
              </Box>
              <Box flex={1}>
                <Typography
                  variant="subtitle2"
                  color="#64748b"
                  fontWeight="600"
                  gutterBottom
                >
                  Current Location
                </Typography>
                <Typography variant="h6" fontWeight="700" color="#1e293b">
                  {profile.currentLocation || "Not specified"}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="flex-start" gap={3}>
              <Box
                sx={{
                  bgcolor: "#f0fdf4",
                  p: 1.5,
                  borderRadius: 3,
                  boxShadow: "0 4px 15px rgba(34, 197, 94, 0.15)",
                }}
              >
                <Map sx={{ color: "#22c55e", fontSize: 32 }} />
              </Box>
              <Box flex={1}>
                <Typography
                  variant="subtitle2"
                  color="#64748b"
                  fontWeight="600"
                  gutterBottom
                >
                  Preferred Location
                </Typography>
                <Typography variant="h6" fontWeight="700" color="#1e293b">
                  {profile.preferredLocation ||
                    "Open to opportunities anywhere"}
                </Typography>
              </Box>
            </Box>
          </Stack>

          {/* Skills Section */}
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box
                sx={{
                  bgcolor: "#f3e8ff",
                  p: 1.5,
                  borderRadius: 3,
                  boxShadow: "0 4px 15px rgba(147, 51, 234, 0.15)",
                }}
              >
                <Code sx={{ color: "#9333ea", fontSize: 32 }} />
              </Box>
              <Typography variant="h6" fontWeight="700" color="#1e293b">
                Technical Skills
              </Typography>
            </Box>

            {profile.skills?.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {profile.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="medium"
                    sx={{
                      bgcolor: "#6366f1",
                      color: "white",
                      fontWeight: 600,
                      height: 38,
                      fontSize: "0.95rem",
                      "&:hover": {
                        bgcolor: "#4f46e5",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(99,102,241,0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary" fontStyle="italic">
                No skills added yet. Add them to get better job matches!
              </Typography>
            )}
          </Box>

          {/* Experience & Notice Period */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            <Box flex={1} display="flex" alignItems="flex-start" gap={3}>
              <Box
                sx={{
                  bgcolor: "#fff7ed",
                  p: 1.5,
                  borderRadius: 3,
                  boxShadow: "0 4px 15px rgba(251, 146, 60, 0.15)",
                }}
              >
                <Timer sx={{ color: "#fb923c", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="#64748b"
                  fontWeight="600"
                  gutterBottom
                >
                  Notice Period
                </Typography>
                <Typography variant="h5" fontWeight="800" color="#ea580c">
                  {profile.noticePeriod} days
                </Typography>
              </Box>
            </Box>

            <Box flex={1} display="flex" alignItems="flex-start" gap={3}>
              <Box
                sx={{
                  bgcolor: "#ecfdf5",
                  p: 1.5,
                  borderRadius: 3,
                  boxShadow: "0 4px 15px rgba(34, 197, 94, 0.15)",
                }}
              >
                <TrendingUp sx={{ color: "#22c55e", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="#64748b"
                  fontWeight="600"
                  gutterBottom
                >
                  Total Experience
                </Typography>
                <Typography variant="h5" fontWeight="800" color="#16a34a">
                  {profile.experience} years
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{ p: 4, bgcolor: "#ffffff", borderTop: "1px solid #e2e8f0" }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          fullWidth
          sx={{
            py: 2,
            borderRadius: 4,
            fontWeight: 700,
            fontSize: "1.1rem",
            bgcolor: "#6366f1",
            textTransform: "none",
            boxShadow: "0 8px 25px rgba(99,102,241,0.3)",
            "&:hover": {
              bgcolor: "#4f46e5",
              transform: "translateY(-3px)",
              boxShadow: "0 12px 30px rgba(99,102,241,0.4)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
