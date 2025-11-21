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
 Avatar
} from '@mui/material';
import {
 AccountCircle,
 LocationOn,
 Work,
 Timer,
 Code,
 TrendingUp
} from '@mui/icons-material';

export default function MyProfileModal({ open, onClose, profile }) {
 if (!profile) return null;

 return (
   <Dialog
     open={open}
     onClose={onClose}
     maxWidth="sm"
     fullWidth
     PaperProps={{
       sx: {
         borderRadius: 4,
         boxShadow: '0 10px 40px rgba(248, 240, 240, 0.08)',
         overflow: 'hidden',
       }
     }}
   >
     {/* Clean white header with subtle bottom border */}
     <DialogTitle sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #f1f5f9', py: 4 }}>
       <Box display="flex" alignItems="center" gap={3}>
         <Avatar
           sx={{
             width: 72,
             height: 72,
             bgcolor: '#f8fafc',
             color: '#1e293b',
             fontSize: 32,
             fontWeight: 'bold',
             border: '3px solid #e2e8f0'
           }}
         >
           {profile.name.charAt(0).toUpperCase()}
         </Avatar>
         <Box>
           <Typography variant="h5" fontWeight="700" color="#0f172a">
             {profile.name}
           </Typography>
           <Typography variant="body1" color="#64748b" fontWeight="500">
             {profile.targetJobTitle}
           </Typography>
         </Box>
       </Box>
     </DialogTitle>

     <DialogContent sx={{ bgcolor: '#fafbfc', py: 5, px: 5 }}>
       <Box sx={{ display: 'grid', gap: 4.5 }}>

         {/* Current Location */}
         <Box display="flex" alignItems="flex-start" gap={3}>
           <LocationOn sx={{ color: '#64748b', fontSize: 28, mt: 0.5 }} />
           <Box>
             <Typography variant="body2" color="#64748b" fontWeight="500">
               Current Location
             </Typography>
             <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mt: 0.5 }}>
               {profile.currentLocation}
             </Typography>
           </Box>
         </Box>

         <Divider sx={{ bgcolor: '#e2e8f0' }} />

         {/* Preferred Location */}
         <Box display="flex" alignItems="flex-start" gap={3}>
           <Work sx={{ color: '#64748b', fontSize: 28, mt: 0.5 }} />
           <Box>
             <Typography variant="body2" color="#64748b" fontWeight="500">
               Preferred Location
             </Typography>
             <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mt: 0.5 }}>
               {profile.preferredLocation}
             </Typography>
           </Box>
         </Box>

         <Divider sx={{ bgcolor: '#e2e8f0' }} />

         {/* Skills */}
         <Box>
           <Box display="flex" alignItems="center" gap={3} mb={2}>
             <Code sx={{ color: '#64748b', fontSize: 28 }} />
             <Typography variant="body2" color="#64748b" fontWeight="500">
               Skills
             </Typography>
           </Box>
           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
             {profile.skills?.map((skill, i) => (
               <Chip
                 key={i}
                 label={skill}
                 size="medium"
                 sx={{
                   bgcolor: '#f1f5f9',
                   color: '#334155',
                   fontWeight: 600,
                   borderRadius: '12px',
                   height: 38,
                   fontSize: '0.95rem',
                   px: 1
                 }}
               />
             ))}
           </Box>
         </Box>

         <Divider sx={{ bgcolor: '#e2e8f0' }} />

         {/* Notice Period & Experience – Side by side on larger screens */}
         <Box display="flex" gap={6} flexDirection={{ xs: 'column', sm: 'row' }}>
           <Box display="flex" alignItems="flex-start" gap={3} flex={1}>
             <Timer sx={{ color: '#64748b', fontSize: 28, mt: 0.5 }} />
             <Box>
               <Typography variant="body2" color="#64748b" fontWeight="500">Notice Period</Typography>
               <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mt: 0.5 }}>
                 {profile.noticePeriod} days
               </Typography>
             </Box>
           </Box>
              <Divider sx={{ bgcolor: '#e2e8f0' }} />

           <Box display="flex" alignItems="flex-start" gap={3} flex={1}>
             <TrendingUp sx={{ color: '#64748b', fontSize: 28, mt: 0.5 }} />
             <Box>
               <Typography variant="body2" color="#64748b" fontWeight="500">Experience</Typography>
               <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mt: 0.5 }}>
                 {profile.experience} years
               </Typography>
             </Box>
           </Box>
         </Box>

       </Box>
     </DialogContent>

     {/* Clean, minimal close button */}
     <DialogActions sx={{ p: 4, bgcolor: '#ffffff' }}>
       <Button
         onClick={onClose}
         variant="outlined"
         size="large"
         fullWidth
         sx={{
           py: 1,
           borderColor: '#cbd5e1',
           color: '#475569',
           fontWeight: 600,
           textTransform: 'none',
           fontSize: '1.05rem',
           borderRadius: 3,
           '&:hover': {
             borderColor: '#94a3b8',
             bgcolor: '#f8fafc'
           }
         }}
       >
         Close
       </Button>
     </DialogActions>
   </Dialog>
 );
}