import React, { useContext, useEffect } from "react";
import "../../style/userTable.css";
import { User } from "../../classes/User";
import UserRow from "./UserRow";
import ImportForm from "./ImportForm";
import { Container } from "react-bootstrap";
import AddUserForm from "./AddUserForm";
import { UserContext } from "../../App";
import { useHttp } from "../../hooks/useHttp";

const ManageUsers = () => {
  const [users, setUsers] = React.useState<Array<User>>([]);
  const { user } = useContext(UserContext);

  const { isLoading, error, sendRequest: fetchUserData } = useHttp(
    { url: "http://127.0.0.1:3000/api/users" },
    (data) => { setUsers(data.users) },
    user.token
  );

  useEffect(() => {
    // Load data
    fetchUserData();
  }, []);

  return (
    <div>
      <ImportForm taskName="Users" uploadUrl="http://127.0.0.1:3000/api/users/upload" />
      <Container className="mt-3">
        <div className="rowC">
          <h2 style={{ marginBottom: "20px" }}>All Users</h2>
          <AddUserForm fetchUserData={fetchUserData} />
        </div>
        <div id="taCourseInfoTable">
          <table>
            <thead>
              <tr>
                <th className="column0"></th>
                <th className="column1">Email</th>
                <th className="column2">First name</th>
                <th className="column3">Last name</th>
                <th className="column4">User Type</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User, i: number) => {
                if (user) {
                  return <UserRow key={i} user={user} fetchUserData={fetchUserData} />;
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

export default ManageUsers;
