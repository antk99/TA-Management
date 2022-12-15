import React, { useContext } from "react";
import RemoveIcon from "@material-ui/icons/Remove";
import { Course } from "../../classes/Course";
import { UserContext } from "../../App";
import getFullyQualifiedUrl from "../../helpers/host";

const CourseRow = ({ course, fetchCourseData }: { course: Course; fetchCourseData: Function }) => {
  const { user } = useContext(UserContext);

  const handleDeleteCourse = async () => {
    // delete from db
    try {
      const response = await fetch(getFullyQualifiedUrl("/api/course/delete/"), {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + user.token, "Content-Type": "application/json" },
        body: JSON.stringify({ courseNumber: course.courseNumber }),
      });

      if (!response.ok)
        throw new Error("Could not remove course.");
      else {
        // delete from state
        fetchCourseData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <tr className="body">
      <td className="column0">
        <button className="btn btn-secondary" onClick={handleDeleteCourse} style={{ color: "red" }}>
          <RemoveIcon />
        </button>
      </td>
      <td className="column1">{course.courseNumber}</td>
      <td className="column2">{course.courseName}</td>
      <td className="column3">{course.courseDesc}</td>
      <td className="column4">{course.term}</td>
      <td className="column5">{course.year}</td>
      <td className="column6">{course.instructorName}</td>
    </tr>
  );
};

export default CourseRow;
