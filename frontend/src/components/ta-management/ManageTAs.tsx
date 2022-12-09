import React, { useEffect } from "react";
import "../../style/course.css";
import { Course } from "../../classes/Course";
import SelectCourses from "./SelectCourses";
import ManageCourse from "./ManageCourse";
import { useState } from "react";
import { fetchCourseData } from "../../helpers/fetchCourseData";
import { UserContext } from "../../App";
import { ProfileContext } from "../../pages/Dashboard";
import { UserTypes } from "../../enums/UserTypes";

interface CourseProviderProps {
  courses: Array<Course>;
  course: Course;
  setSelectedCourseId: Function;
  fetchCourseData: Function;
}

export const CourseContext = React.createContext<CourseProviderProps>({ 
  courses: [],
  course: null,
  setSelectedCourseId: () => { },
  fetchCourseData: () => { } }
);

const ManageTAs = () => {
  const [courses, setCourses] = React.useState<Array<Course>>([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { user } = React.useContext(UserContext);
  const { profile } = React.useContext(ProfileContext);

  const fetchCourses = async () => {
    const courses = await fetchCourseData(user.token, profile, user.id);
    setCourses(courses);
  }

  useEffect(() => {
    fetchCourses();
  }, [profile, user])

  useEffect(() => {
    if(selectedCourseId) {
      setSelectedCourse(courses.find((course) => course.id === selectedCourseId));
    } else {
      setSelectedCourse(null);
    }
  }, [selectedCourseId, courses])


  return(
    <CourseContext.Provider value={{ courses, course: selectedCourse, setSelectedCourseId, fetchCourseData: fetchCourses }} >
      {selectedCourse &&
        <ManageCourse />
      }
      {!selectedCourse &&
        <SelectCourses courses={courses} setSelectedCourseId={setSelectedCourseId}/>
      }
    </CourseContext.Provider>
  )
};

export default ManageTAs;
