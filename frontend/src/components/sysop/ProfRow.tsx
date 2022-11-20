import React, { useState, useEffect } from "react";
import RemoveIcon from "@material-ui/icons/Remove";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import "../../style/userTable.css";
import { Professor } from "../../classes/Professor";
import { Course } from "../../classes/Course";

const ProfRow = ({ professor, fetchProfData }: { professor: Professor; fetchProfData: Function }) => {
  const [show, setShow] = useState(false);
  const [courses, setCourses] = useState<Array<Course>>([]);

  const handleDeleteProf = () => {
    try {
      // make API call to delete prof
    } catch (e) { }
  };

  return (
    <tr className="body">
      <td className="column0">
        <button className="btn btn-secondary" onClick={handleDeleteProf}>
          <RemoveIcon />
        </button>
      </td>
      <td className="column1">{professor.email}</td>
      <td className="column2">{professor.firstName}</td>
      <td className="column3">{professor.lastName}</td>
      <td className="column4">{professor.faculty}</td>
      <td className="column5">{professor.department}</td>
      <td className="column6 course-button">
      <>
        <button className="courses" onClick={() => setShow(true)}>
          <OpenInFullIcon fontSize="small" /> View Courses
        </button>
      </>
      </td>
    </tr>
  );
};

export default ProfRow;
