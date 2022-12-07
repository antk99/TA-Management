import { ChevronLeft } from "@mui/icons-material";
import React, { useContext } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { UserTypes } from "../../enums/UserTypes";
import { ProfileContext } from "../../pages/Dashboard";
import "../../style/course.css";
import ManageOfficeHours from "./ManageOfficeHours";
import { CourseContext } from "./ManageTAs";
import PerformanceLog from "./PerformanceLog";

const ManageCourse = () => {
  const { profile } = useContext(ProfileContext)
  const { course, setSelectedCourseId } = useContext(CourseContext);
  
  const changeCourse = () => {
      setSelectedCourseId(null);
  }

  return (
    <div className="mt-3">
      <Button onClick={() => changeCourse()} variant="outline-secondary" size="sm"><ChevronLeft fontSize="small"/> Change course</Button>
        <h2 className="mt-3">{course.courseName}</h2>

        <Tabs
            defaultActiveKey="officeHours"
            id="uncontrolled-tab-example"
            className="mb-3 mt-3"
        >
          <Tab eventKey="officeHours" title="Office hours and responsibilities">
              <ManageOfficeHours />
          </Tab>
          {profile === UserTypes.Professor &&
            <Tab eventKey="taManagement" title="Performance log">
              <PerformanceLog />
            </Tab>
          }
        </Tabs>
    </div>
  );
};

export default ManageCourse;
