import React from "react";

const CourseRowNoDesc = props => {
    return (
        <tr className="body">
            <td className="column1">
                <div className="links" style={{textDecoration: "underline", padding:"10px"}} 
                onClick={ () => {props.setCourse(props.course.courseNumber + " " + props.course.term + " " + props.course.year + " " + props.course.id);} }>
                    {props.course.courseNumber}
                </div>
            </td>
            <td className="column2">{props.course.courseName}</td>
            <td className="column4">{props.course.term}</td>
            <td className="column5">{props.course.year}</td>
        </tr>
    );
  };

export default CourseRowNoDesc;