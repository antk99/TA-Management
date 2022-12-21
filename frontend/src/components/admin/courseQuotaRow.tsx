import React from "react";
import "../../style/userTable.css";
import "../../style/taTable.css";
import WarningIcon from '@mui/icons-material/Warning';
import EditIcon from '@mui/icons-material/Edit';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import EditCourseQuotaForm from "./EditCourseQuotaForm";

const CourseQuotaRow = ({ course, fetchData }) => {
    const [showEditCourse, setShowEditCourse] = React.useState(false);

    const studentsPerTA = course.enrollmentNumber / course.taQuota;
    const needsAttention = studentsPerTA < 30 || studentsPerTA > 45;
    const className = needsAttention ? "courseQuotaFlagged" : "courseQuotaNormal";
    const warningText = `This course needs immediate attention. The # of students per TA is ${Math.floor(studentsPerTA)}. It should be between 30 and 45.`;

    return (
        <>
            <EditCourseQuotaForm quotaToEdit={course} fetchCourseData={fetchData} show={showEditCourse} setShow={setShowEditCourse} />
            <tr className={className}>
                <td className="column0">
                    {
                        needsAttention &&
                        <OverlayTrigger placement='top' overlay={<Tooltip>{warningText}</Tooltip>}>
                            {needsAttention && <WarningIcon style={{ color: "orange" }} />}
                        </OverlayTrigger>
                    }
                </td>
                <td className="column1">{course.courseNumber}</td>
                <td className="column2">{course.courseName}</td>
                <td className="column3">{course.termYear}</td>
                <td className="column4">{course.courseType}</td>
                <td className="column5">{course.instructorName}</td>
                <td className="column6">{course.enrollmentNumber}</td>
                <td className="column7">{course.taQuota}</td>
                <td className="column0">
                    <button className="btn btn-secondary" onClick={() => { setShowEditCourse(true) }} style={{ color: "darkgray", alignSelf: "center" }}>
                        <EditIcon />
                    </button>
                </td>
            </tr>
        </>
    );
};

export default CourseQuotaRow;
