import React from "react";
import "../../style/course.css";
import { Container } from "react-bootstrap";
import { Course } from "../../classes/Course";

const SelectCourses = ({ courses, setSelectedCourseId }) => {
  return (
      <Container className="mt-3">
        <div className="rowC">
          {courses.length > 0 &&
            <h2 style={{ marginBottom: "20px" }}>Select a course</h2> 
          }
          {courses.length === 0 &&
            <h2 style={{ marginBottom: "20px" }}>You are currently not registered in any course.</h2> 
          }
        </div>
        <div className="select__courses">
         {courses.map((course: Course) => (
            <div onClick={() => setSelectedCourseId(course.id)} className="select__course__card" key={course.courseNumber}>
              <div className="select__course__header" style={{ backgroundImage: "url(https://source.unsplash.com/collection/1499877/720x420)" }}>
                <div className="select__course__header__content">
                  <p className="select__course__number">{course.courseNumber}</p>
                </div>
              </div>
              <div className="select__course__content">
                <p className="select__course__title">{course.courseName}</p>
                <p className="select__course__term">{`${course.term} ${course.year} \u2022 ${course.instructorName}`}</p>
              </div>
            </div>
         ))} 
        </div>
      </Container>
  );
};

export default SelectCourses;
