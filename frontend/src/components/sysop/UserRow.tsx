import React, { useState, useEffect } from "react";
import RemoveIcon from "@material-ui/icons/Remove";
import "../../style/userTable.css";
import { User } from "../../classes/User";

const UserRow = ({ user, fetchUserData }: { user: User; fetchUserData: Function }) => {
  const [show, setShow] = useState(false);
  const handleDeleteUser = () => {
    try {
      // make API call to delete user
    } catch (e) { }
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
