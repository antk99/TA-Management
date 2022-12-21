import React from "react";
import RateTAForm from "./RateTAForm"

const TARow = props => {
    return (
      <tr className="body">
        <td className="ta-td" style={{borderLeft: "0px", borderRight: "0px"}}>
          {(props.TA.fullName ? props.TA.name + ", " : "") + props.TA.email}
        </td>
        
        <td className="ta-td" style={{borderLeft: "0px", borderRight: "0px"}}> 
          <RateTAForm  
            taName={props.TA.fullName ? props.TA.name : props.TA.email} 
            taStdNum={props.TA.studentID} 
            courseCode={props.courseCode} 
          /> 
        </td>
      </tr>
    );
};

export default TARow;