import React, { useState, useEffect, useContext } from "react";
import RemoveIcon from "@material-ui/icons/Remove";
import EditIcon from '@mui/icons-material/Edit';
import "../../style/userTable.css";
import { User } from "../../classes/User";
import { UserContext } from "../../App";
import getFullyQualifiedUrl from "../../helpers/host";
import EditUserForm from "./EditUserForm";

const UserRow = ({ user, fetchUserData }: { user: User; fetchUserData: Function }) => {
  const { user: userLoggedIn } = useContext(UserContext);
  const [showEditUserForm, setShowEditUserForm] = useState(false);

  const handleDeleteUser = async () => {
    // delete from db
    try {
      const response = await fetch(getFullyQualifiedUrl("/api/users/delete/" + user.email), {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + userLoggedIn.token, "Content-Type": "application/json" }
      });

      if (!response.ok)
        throw new Error("Could not remove user.");
      else {
        // delete from state
        fetchUserData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <EditUserForm userToUpdate={user} fetchUserData={fetchUserData} show={showEditUserForm} setShow={setShowEditUserForm} />
      <tr className="body">
        <td className="column0">
          <button className="btn btn-secondary" onClick={handleDeleteUser} style={{ color: "red" }}>
            <RemoveIcon />
          </button>
        </td>
        <td className="column1">{user.email}</td>
        <td className="column2">{user.firstName}</td>
        <td className="column3">{user.lastName}</td>
        <td className="column5">{user.userType.join(", ")}</td>
        <td className="column0">
          <button className="btn btn-secondary" onClick={() => { setShowEditUserForm(true) }} style={{ color: "darkgray" }}>
            <EditIcon />
          </button>
        </td>
      </tr>
    </>
  );
};

export default UserRow;
