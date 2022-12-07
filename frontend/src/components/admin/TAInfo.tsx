import React from 'react';
import { Card, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import '../../style/taInfoPage.css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TAInfoCard from './TAInfoCard';
import LabelledTextbox from './LabelledTextbox';
import TAActionsBar from './TAActionsBar';

const booleanToYesNo = (bool) => { return bool ? "Yes" : "No" };
const arrToString = (arr) => { return arr.join(", ") };

const TAInfo = ({ ta, exitTAInfoView, modifyCurrCourses }) => {
    const [isAtBottom, setIsAtBottom] = React.useState<boolean>(false);

    React.useEffect(() => {
        document.addEventListener("scroll", () => {
            window.innerHeight + window.pageYOffset >= document.body.offsetHeight ? setIsAtBottom(true) : setIsAtBottom(false);
        });
    }, []);

    const cohortFields = [
        { label: "Email", value: ta.email },
        { label: "Student ID", value: ta.studentID },
        { label: "Phone Number", value: ta.phone },
        { label: "Degree", value: ta.degree },
        { label: "Level", value: ta.level },
        { label: "Priority", value: booleanToYesNo(ta.priority) },
        { label: "Supervisor", value: ta.supervisorName },
        { label: "Location", value: ta.location },
        { label: "Date Applied", value: ta.dateApplied },
        { label: "Courses Applied For", value: arrToString(ta.coursesAppliedFor) },
        { label: "Open To Other Courses", value: booleanToYesNo(ta.openToOtherCourses) },
        { label: "Hours", value: ta.hours },
        { label: "Current Courses", value: arrToString(ta.currCourses) },
        { label: "Previous Courses", value: arrToString(ta.prevCourses) }
    ];

    const midPoint = Math.ceil(cohortFields.length / 2);

    /* DUMMY DATA */
    const wishlistMemberships = ["Joseph Vybihal", "John Doe", "Jane Doe", "John Smith", "Jane Smith"];
    const professorPerformanceLogs = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ];
    const studentComments = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ];

    const wishlistMembershipTitle = (
        <>
            Professor Wishlists&nbsp;
            <OverlayTrigger placement='top'
                overlay={<Tooltip>These are the professors that have this TA on their wishlist.</Tooltip>}>
                <InfoOutlinedIcon fontSize='small' />
            </OverlayTrigger>
        </>
    );

    const hasPerformanceLogs = professorPerformanceLogs.length > 0;
    const hasStudentComments = studentComments.length > 0;
    const hasWishlistMembership = wishlistMemberships.length > 0;

    return (
        <div className="taInfoContainer">
            <button className="btn btn-secondary" onClick={exitTAInfoView}>
                <ArrowBackRoundedIcon />
            </button>

            <Container className="mt-3 taInfo" style={{ marginBottom: "20px" }}>
                <div className="rowC">
                    <h2>
                        {ta.name}
                        {ta.name !== ta.legalName && ` (${ta.legalName})`}
                        &nbsp;
                    </h2>
                    <OverlayTrigger placement='top' overlay={<Tooltip>Student Rating Average</Tooltip>}>
                        <span style={{ alignSelf: "center", fontSize: "28px" }}>⭐⭐⭐⭐⭐</span>
                    </OverlayTrigger>
                </div>



                <TAInfoCard title="Cohort Information" style={{ width: '100%' }} maxHeight="fit-content" flexDirection="row">
                    <div className="cohortFields">
                        {cohortFields.slice(0, midPoint).map((field, index) => (
                            <LabelledTextbox key={index} label={field.label} value={field.value !== "" ? field.value : "None"} />
                        ))}
                    </div>
                    <div className="cohortFields">
                        {cohortFields.slice(midPoint).map((field, index) => (
                            <LabelledTextbox key={index} label={field.label} value={field.value} />
                        ))}
                    </div>
                </TAInfoCard>

                <TAInfoCard title={wishlistMembershipTitle}>
                    <div className="wishlistProfessors">
                        {hasWishlistMembership && wishlistMemberships.map((prof) => (
                            <LabelledTextbox key={prof} value={prof} />
                        ))}

                        {!hasWishlistMembership && "No professors have this student on their wishlist."}
                    </div>
                </TAInfoCard>

                <TAInfoCard title="Professor Performance Logs" centerText={!hasPerformanceLogs}>
                    {hasPerformanceLogs && professorPerformanceLogs.map((log, index) => (
                        <LabelledTextbox key={index} label={"Joseph Vybihal"} value={log} />
                    ))}

                    {!hasPerformanceLogs && "No performance logs found."}
                </TAInfoCard>

                <TAInfoCard title="Student Comments" centerText={!hasStudentComments} style={{ marginBottom: "20px" }}>
                    {hasStudentComments && studentComments.map((comment, index) => (
                        <LabelledTextbox key={index} label={"⭐⭐⭐⭐"} value={comment} />
                    ))}

                    {!hasStudentComments && "No student comments found."}
                </TAInfoCard>

                <TAActionsBar currCourses={ta.currCourses} modifyCurrCourses={(newCurrCourses) => modifyCurrCourses(ta.studentID, newCurrCourses)} isAtBottom={isAtBottom} />
            </Container>
        </div>
    );
};

export default TAInfo;