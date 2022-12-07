import React, { useContext } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { UserTypes } from "../../enums/UserTypes";
import { ProfileContext } from "../../pages/Dashboard";
import "../../style/course.css";
import ManageOfficeHours from "./ManageOfficeHours";
import { CourseContext } from "./ManageTAs";
import PerformanceLog from "./PerformanceLog";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import WishList from "./WishList";


const ManageCourse = () => {
  const { profile } = useContext(ProfileContext)
  const { course, setSelectedCourseId } = useContext(CourseContext);
  
  const changeCourse = () => {
      setSelectedCourseId(null);
  }

  return (
    <>
      <button className="btn btn-secondary" onClick={changeCourse}>
            <ArrowBackRoundedIcon />
        </button>
      <Container className="mt-3 taInfo">
        {/* <Button onClick={() => changeCourse()} variant="outline-secondary" size="sm"><ChevronLeft fontSize="small"/> Change course</Button> */}
          {/* <h2 className="mt-3">{course.courseName}</h2> */}
          <h2>
              {course.courseName}
          </h2>
          <Tabs
              defaultActiveKey="officeHours"
              id="uncontrolled-tab-example"
              className="mb-3"
          >
            <Tab eventKey="officeHours" title="Office hours and responsibilities">
                <ManageOfficeHours />
            </Tab>
            {profile === UserTypes.Professor &&
                <Tab eventKey="performanceLog" title="Performance log">
                  <PerformanceLog />
                </Tab>
            }
            {profile === UserTypes.Professor &&
                <Tab eventKey="wishList" title="Wish-list">
                  <WishList />
                </Tab>
            }
          </Tabs>
      </Container>
    </>
  );
};

export default ManageCourse;
