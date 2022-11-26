import React from "react";
import "../../style/course.css";
import { Course } from "../../classes/Course";
import SelectCourses from "./SelectCourses";

const ManageTAs = () => {
  // const [courses, setCourses] = React.useState<Array<Course>>([]);
  const [selectedCourse, setSelectedCourse] = React.useState<Course>(null);

  const selectCourse = (course: Course) => {
    console.log(course)
    setSelectedCourse(course);
  }

  if(selectedCourse) {
    return <div>Selected course: {selectedCourse.courseNumber}</div>
  }

  return <SelectCourses selectCourse={selectCourse}/>
};

export default ManageTAs;
