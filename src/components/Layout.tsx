import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PeopleIcon from "@mui/icons-material/People";
import BookIcon from "@mui/icons-material/Book";
import SchoolIcon from "@mui/icons-material/School";
import ViewListIcon from "@mui/icons-material/ViewList";
import ClassIcon from "@mui/icons-material/Class";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { Link } from "react-router-dom";
import UserTable from "./UserTable.tsx";
import SectionTable from "./SectionTable.tsx";
import { Routes, Route } from "react-router-dom";
import {MasterSchedule} from "./MasterSchedule.tsx";
import LectureTable from "./LectureTable.tsx";
import BackHandIcon from "@mui/icons-material/BackHand";
import ClassroomTable from "./ClassroomTable.tsx";
import CourseTable from "./CourseTable.tsx";

const drawerWidth = 250;

// Extend the type of the styled component
interface MainContentProps {
  open?: boolean;
}

const MainContent = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})<MainContentProps>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));

const AppBarButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

const AppDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
}));

const Sidebar = ({ open, onToggle }) => (
  <AppDrawer variant="persistent" anchor="left" open={open}>
    <IconButton sx={{ borderRadius: "0px" }} onClick={onToggle}>
      <ChevronLeftIcon />
    </IconButton>
    <List>
      <ListItem key="Users" component={Link} to="/users">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItem>
      <ListItem key="Courses" component={Link} to="/courses">
        <ListItemIcon>
          <BookIcon />
        </ListItemIcon>
        <ListItemText primary="Courses" />
      </ListItem>
      <ListItem key="Lecturers" component={Link} to="/lecturers">
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="Lecturers" />
      </ListItem>
      <ListItem key="Lectures" component={Link} to="/lectures">
        <ListItemIcon>
          <BackHandIcon />
        </ListItemIcon>
        <ListItemText primary="Lectures" />
      </ListItem>
      <ListItem key="Sections" component={Link} to="/sections">
        <ListItemIcon>
          <ViewListIcon />
        </ListItemIcon>
        <ListItemText primary="Sections" />
      </ListItem>
      <ListItem key="Classrooms" component={Link} to="/classrooms">
        <ListItemIcon>
          <ClassIcon />
        </ListItemIcon>
        <ListItemText primary="Classrooms" />
      </ListItem>
      <ListItem key="Schedule" component={Link} to="/schedule">
        <ListItemIcon>
          <ChecklistIcon />
        </ListItemIcon>
        <ListItemText primary="Schedule" />
      </ListItem>
    </List>
  </AppDrawer>
);

const Layout = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div>
      <AppBarButton
        color="inherit"
        aria-label={open ? "close drawer" : "open drawer"}
        onClick={toggleDrawer}
        edge="start"
        sx={{ ...(open && { display: "none" }) }}
      >
        {open ? <ChevronLeftIcon /> : <MenuIcon />}
      </AppBarButton>
      <Sidebar open={open} onToggle={toggleDrawer} />
      <MainContent open={open} theme={undefined}>
        <Routes>
          <Route path="/users" element={<UserTable />} />
          <Route path="/courses" element={<CourseTable />} />
          <Route path="/sections" element={<SectionTable />} />
          <Route path="/lectures" element={<LectureTable />} />
          <Route path="/classrooms" element={<ClassroomTable />} />
          <Route path="/schedule" element={<MasterSchedule />} />
        </Routes>
      </MainContent>
    </div>
  );
};

export default Layout;
