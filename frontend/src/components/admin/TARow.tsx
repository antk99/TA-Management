import React, { useState, useEffect } from "react";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import "../../style/userTable.css";
import { TA } from "../../classes/TA";
import "../../style/taTable.css";
import AdminButton from "./AdminButton";

const UserRow = ({ ta, focusStudent }: { ta: TA, focusStudent: Function }) => {

    return (
        <tr className="body">
            <td className="column0">
                <AdminButton style={{ border: "none" }} onClick={() => { focusStudent(ta.studentID) }}>
                    <AccountBoxIcon />
                </AdminButton>
            </td>
            <td className="column1">{ta.name}</td>
            <td className="column2">{ta.email}</td>
            <td className="column3">{ta.studentID}</td>
            <td className="column4">{ta.currCourses.join(", ")}</td>
            <td className="column5">{ta.prevCourses.join(", ")}</td>
        </tr>
    );
};

export default UserRow;
