import React, { useState, useEffect, useContext } from "react";
import RemoveIcon from "@material-ui/icons/Remove";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import "../../style/userTable.css";
import { Professor } from "../../classes/Professor";
import { Course } from "../../classes/Course";
import { UserContext } from "../../App";
import { useHttp } from "../../hooks/useHttp";
import getFullyQualifiedUrl from "../../helpers/host";

const ProfRow = ({ professor, fetchProfData }: { professor: Professor; fetchProfData: Function }) => {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState<Array<any>>([]);

  const { isLoading, error, sendRequest: fetchCourses } = useHttp(
    { url: "/api/course/instructor/" + professor.uuid },
    (data) => {
      let c = data.courses;
      c = c.map((course => course.courseNumber));
      setCourses(c);
    },
    user.token
  );

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteProf = async () => {
    try {
      const response = await fetch(getFullyQualifiedUrl("/api/prof/delete/" + professor.email),
        {
          method: "DELETE", headers: { "Authorization": "Bearer " + user.token, "Content-Type": "application/json" }
        });

      if (!response.ok)
        throw new Error("Could not remove professor.");
      else {
        // delete from state
        fetchProfData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <tr className="body">
      <td className="column0">
        <button className="btn btn-secondary" onClick={handleDeleteProf} style={{ color: "red" }}>
          <RemoveIcon />
        </button>
      </td>
      <td className="column1">{professor.email}</td>
      <td className="column2">{professor.firstName}</td>
      <td className="column3">{professor.lastName}</td>
      <td className="column4">{professor.faculty}</td>
      <td className="column5">{professor.department}</td>
      <td className="column6">{courses.join(", ")}</td>
    </tr>
  );
};

export default ProfRow;
