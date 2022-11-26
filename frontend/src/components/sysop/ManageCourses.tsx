import React, { useEffect, useState } from "react";
import AddCourseForm from "./AddCourseForm";
import CourseRow from "./CourseRow";
import "../../style/userTable.css";
import { Course } from "../../classes/Course";
import ImportForm from "./ImportForm";
import { Container } from "react-bootstrap";
import { fetchCourseData } from "../../helpers/fetchCourseData";

const ManageCourses = () => {
  const [courses, setCourses] = useState<Array<Course>>([]);

  useEffect(() => {
    async function fetchCourses() {
      const courses = await fetchCourseData();
      setCourses(courses);
    }
    fetchCourses()
  }, []);

  return (
    <div>
      <ImportForm taskName="Courses" uploadUrl="http://127.0.0.1:3000/api/course/upload"/>
      <Container className="mt-3">
        <div className="rowC">
          <h2 style={{ marginBottom: "20px" }}>All Courses</h2> 
          <AddCourseForm fetchCourseData={fetchCourseData} />
        </div>
        <div id="profTable">
          <table>
            <thead>
              <tr>
                <th className="column0"></th>
                <th className="column1">Course Number</th>
                <th className="column2">Course Name</th>
                <th className="column3">Course Description</th>
                <th className="column4">Course Semester</th>
                <th className="column5">Course Year</th>
                <th className="column6">Course Instructor</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course: Course, i: number) => (
                <CourseRow key={i} course={course} fetchCourseData={fetchCourseData} />
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
};

export default ManageCourses;
