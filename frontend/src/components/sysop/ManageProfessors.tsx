import React, { useContext, useEffect } from "react";
import AddProfForm from "./AddProfForm";
import ProfRow from "./ProfRow";
import "../../style/userTable.css";
import { Professor } from "../../classes/Professor";
import ImportForm from "./ImportForm";
import { Container } from "react-bootstrap";
import { UserContext } from "../../App";
import { useHttp } from "../../hooks/useHttp";
import getFullyQualifiedUrl from "../../helpers/host";

const ManageProfessors = () => {
  const [profs, setProfs] = React.useState<Array<Professor>>([]);
  const { user } = useContext(UserContext);

  const { isLoading, error, sendRequest: fetchProfData } = useHttp(
    { url: "/api/prof" },
    async (data) => {
      const profObject = [];
      for (const d of data.profs) {
        const instructorRes = await fetch(
          getFullyQualifiedUrl("/api/users/" + d.professor),
          { headers: { Authorization: "Bearer " + user.token } }
        );
        let item = {
          faculty: d.faculty,
          department: d.department,
        }
        if (instructorRes) {
          const instructorData = await instructorRes.json();
          item["firstName"] = instructorData.user.firstName;
          item["lastName"] = instructorData.user.lastName;
          item["email"] = instructorData.user.email;
          item["uuid"] = d.professor;
        } else {
          item["firstName"] = "";
          item["lastName"] = "";
          item["email"] = "";
          item["uuid"] = "";
        }
        profObject.push(item);
      }
      setProfs(profObject);
    },
    user.token
  );

  useEffect(() => {
    // Load data
    fetchProfData();
  }, []);

  return (
    <div>
      <ImportForm taskName="Professors" uploadUrl="/api/prof/upload" fetchData={fetchProfData} />
      <Container className="mt-3">
        <div className="rowC">
          <h2 style={{ marginBottom: "20px" }}>All Professors</h2>
          <AddProfForm fetchProfData={fetchProfData} />
        </div>
        <div id="taCourseInfoTable">
          <table>
            <thead>
              <tr>
                <th className="column0"></th>
                <th className="column1">Email</th>
                <th className="column2">First name</th>
                <th className="column3">Last name</th>
                <th className="column4">Faculty</th>
                <th className="column5">Department</th>
                <th className="column5">Courses</th>
              </tr>
            </thead>
            <tbody>
              {profs.map((professor: Professor, i: number) => {
                if (professor) {
                  return <ProfRow key={i} professor={professor} fetchProfData={fetchProfData} />;
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
};

export default ManageProfessors;
