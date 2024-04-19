import React from 'react';
import { Container, Grid, Button, Typography, Tooltip, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import ClassroomIcon from '@mui/icons-material/MeetingRoom';
import ScheduleIcon from '@mui/icons-material/Schedule'; // Import the schedule icon
import SeoIllustration from 'src/assets/illustrations/seo-illustration';
import AppWelcome from 'src/components/app-welcome/app-welcome';
import { useSettingsContext } from 'src/components/settings';

export default function OneView() {
  const settings = useSettingsContext();
  const theme = useTheme();

  const iconStyle = { fontSize: 40 }; // Adjust the size as needed

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AppWelcome
            title={`Welcome 👋 \n `}
            description="First input all the necessary data, when you are done you can start generating schedules! "
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary">
                Go Generate!
              </Button>
            }
          />
        </Grid>
        <Box width="100%" textAlign="center">
          <Typography variant="h4" textAlign="center" m={2}>
            Data Managment
          </Typography>
        </Box>
        <Grid item container spacing={2}>
          {[
            { icon: <SchoolIcon style={iconStyle} />, path: 'courses', label: 'Courses' },
            { icon: <GroupIcon style={iconStyle} />, path: 'sections', label: 'Sections' },
            { icon: <BookIcon style={iconStyle} />, path: 'lecturers', label: 'Lecturers' },
            { icon: <ClassroomIcon style={iconStyle} />, path: 'classrooms', label: 'Classrooms' },
            // Add the Schedules button
            {
              icon: <ScheduleIcon style={iconStyle} />,
              path: 'schedules',
              label: 'Schedules',
              comingSoon: true,
            },
          ].map((button, index) => (
            <Grid item xs={6} sm={4} key={index}>
              {button.comingSoon ? (
                <Tooltip title="Coming Soon" arrow>
                  <span>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      startIcon={button.icon}
                      sx={{
                        height: '15vh',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: theme.spacing(1),
                        fontSize: '1.25rem',
                        boxShadow: theme.shadows[3],
                      }}
                    >
                      <Typography variant="button" sx={{ fontWeight: 'bold' }}>
                        {button.label}
                      </Typography>
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={button.icon}
                  onClick={() => {}} // Add your navigation logic here
                  sx={{
                    height: '15vh',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing(1),
                    fontSize: '1.25rem',
                    boxShadow: theme.shadows[3],
                  }}
                >
                  <Typography variant="button" sx={{ fontWeight: 'bold' }}>
                    {button.label}
                  </Typography>
                </Button>
              )}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
