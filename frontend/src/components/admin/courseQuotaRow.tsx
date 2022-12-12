import "../../style/userTable.css";
import "../../style/taTable.css";
import WarningIcon from '@mui/icons-material/Warning';
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const CourseQuotaRow = ({ course }) => {

    const studentsPerTA = course.enrollmentNumber / course.taQuota;
    const needsAttention = studentsPerTA < 30 || studentsPerTA > 45;
    const className = needsAttention ? "courseQuotaFlagged" : "courseQuotaNormal";
    const warningText = `This course needs immediate attention. The # of students per TA is ${Math.floor(studentsPerTA)}. It should be between 30 and 45.`;

    return (
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
        </tr>
    );
};

export default CourseQuotaRow;
