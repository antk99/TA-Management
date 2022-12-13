import React, { useState, useEffect, useContext } from "react";
import RemoveIcon from "@material-ui/icons/Remove";
import "../../style/userTable.css";
import { User } from "../../classes/User";
import { UserContext } from "../../App";

const UserRow = ({ user, fetchUserData }: { user: User; fetchUserData: Function }) => {
  const { user: userLoggedIn } = useContext(UserContext);
  const [show, setShow] = useState(false);

  const handleDeleteUser = async () => {
    // delete from db
    try {
      const response = await fetch("http://localhost:3000/api/users/delete/" + user.email, {
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
    <tr className="body">
      <td className="column0">
        <button className="btn btn-secondary" onClick={handleDeleteUser}>
          <RemoveIcon />
        </button>
      </td>
      <td className="column1">{user.email}</td>
      <td className="column2">{user.firstName}</td>
      <td className="column3">{user.lastName}</td>
      <td className="column5">{user.userType.join(", ")}</td>
    </tr>
  );
};

export default UserRow;
