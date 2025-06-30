# Academic Scheduling System

## Overview

The Academic Scheduling System is a comprehensive solution designed to facilitate the intricate process of managing academic timetables and resource allocation. This web application simplifies the traditionally labor-intensive task of schedule management, handling various facets such as course offerings, classroom assignments, lecturer schedules, and section allocations.

With an intuitive interface, users across the academic spectrum—from administrators to faculty—can engage with the system effortlessly to perform their respective roles.

## The Team

- Karlo Longin
- David Kraljić

## Key Features

- **Automated Schedule Generation**: Create comprehensive academic schedules that respect time constraints, location availability, and lecturer preferences
- **Course Management**: Add, edit, and organize course information including credits, program association, and lab requirements
- **Classroom Administration**: Track classroom details including capacity, location, and special features (lab status)
- **Lecturer Management**: Maintain lecturer profiles with availability information and institutional affiliation
- **Section Organization**: Assign courses to specific sections with designated lecturers and locations
- **Schedule Export**: Share generated schedules in various formats suitable for publication or integration with other calendar systems
- **Customizable Interface**: Adjust visual appearance through light/dark modes, contrast settings, and layout options

## Navigation Guide

### Homepage

The central hub for all system functions featuring:
- Welcome message with guidance for new users
- "Go Generate!" button for quick access to schedule creation
- Data management cards for Courses, Sections, Classrooms, and Lecturers
- Search functionality for locating specific items
- Sidebar menu for consistent navigation throughout the application

### Schedule Generator

The core scheduling tool that allows you to:
- Generate new academic schedules based on inputted data
- Review data before schedule generation
- View the complete weekly calendar in a visual timetable format
- Edit schedules to accommodate special requirements
- Save and export finalized schedules

### Data Management

#### Courses
- Add new courses individually or import via CSV
- Manage course details (name, abbreviation, program, credits, etc.)
- Identify courses requiring lab components

#### Classrooms
- Track classroom information including capacity and special features
- Designate lab vs. standard classroom status
- Manage classroom locations

#### Lecturers
- Maintain lecturer profiles with availability information
- Track institutional affiliation (full-time, part-time, guest)
- Sort and organize lecturer information

#### Sections
- Create class sections with specific capacities
- Assign lecturers to course sections
- Designate physical or virtual locations

### Schedules Overview

- View all generated schedules
- Review creation timestamps
- Export schedules in various formats
- Access detailed views of each schedule

### Settings

Customize your experience with:
- Light/dark mode toggle
- Contrast settings for accessibility
- Layout customization options
- Fullscreen capability
- Color theme presets

## Installation Requirements

**NODE.JS**
* Node 16.x || 18.x

**USING YARN (Recommended)**
```
yarn install
yarn start
```

**USING NPM**
```
npm i OR npm i --legacy-peer-deps
npm start
```

## Getting Started

1. Begin by adding your courses, classrooms, and lecturers to the system
2. Create sections by assigning courses to lecturers and locations
3. Navigate to the Schedule Generator and click "Generate Schedule"
4. Review and edit the generated schedule as needed
5. Save and export your finalized schedule

## Best Practices

- Ensure all data is accurate before generating schedules
- Review generated schedules carefully to identify any conflicts
- Use the export feature to share schedules with stakeholders
- Utilize the search functionality to quickly locate specific items
- Take advantage of the settings panel to customize your experience

---
