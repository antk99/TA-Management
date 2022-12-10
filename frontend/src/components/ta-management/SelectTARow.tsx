import React from "react";
import "../../style/userTable.css";
import { CourseTA } from "../../classes/CourseTA";
import EditTAInformationForm from "./forms/EditTAInformationForm";

const SelectTARow = ({ ta }: { ta: CourseTA; }) => {
    return (
        <tr className="body">
            <td className="column0">
                {ta.fullName}
            </td>
            <td className="column1">{ta.email}</td>
            <td className="column2">
                <ul>
                    {ta.responsabilities.map((responsability, index) => (
                            <li key={index}>{responsability}</li>
                        ))
                    }
                </ul>
            </td>
            <td className="column3">
                <ul>
                    {ta.officeHours.map((officeHour, index) => 
                        (
                            <li key={index}>
                                {officeHour.day} ({ officeHour.periodicity }) - {officeHour.startTime} - {officeHour.endTime} - {officeHour.location}
                            </li>
                        ))
                    }
                </ul>
            </td>
            <td className="column4 course-button">
                <EditTAInformationForm ta={ta} />
            </td>
        </tr>
    );
};

export default SelectTARow;
