import React from 'react';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import '../../style/taInfoPage.css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TAInfoCard from './TAInfoCard';
import LabelledTextbox from './LabelledTextbox';
import TAActionsBar from './TAActionsBar';
import { UserContext } from '../../App';
import { useHttp } from '../../hooks/useHttp';

const booleanToYesNo = (bool) => { return bool ? "Yes" : "No" };
const arrToString = (arr) => { return arr ? arr.length === 0 ? "None" : arr.join(", ") : "" };
const convertScoreToStars = (score) => { return "⭐".repeat(score) }

const TAInfo = ({ ta, exitTAInfoView, modifyCurrCourses }) => {
    const [isAtBottom, setIsAtBottom] = React.useState<boolean>(false);
    const { user } = React.useContext(UserContext);
    const [taCohortInfo, setTACohortInfo] = React.useState<any>({});
    const [wishlists, setWishlists] = React.useState<any>([]);
    const [performanceLogs, setPerformanceLogs] = React.useState<any>([]);
    const [ratings, setRatings] = React.useState<any>([]);

    // fetch cohort info
    const { isLoading: isCohortLoading, error: isCohortError, sendRequest: getCohortInfo } = useHttp(
        { url: "http://localhost:3000/api/cohort/" + ta.studentID },
        (data) => { setTACohortInfo(data.cohortInfo) },
        user.token
    );

    // fetch wishlists
    const { isLoading: isWishlistsLoading, error: isWishlistsError, sendRequest: getWishlists } = useHttp(
        { url: "http://localhost:3000/api/wishlist/ta/" + ta.studentID },
        (data) => { setWishlists(data.wishlist) },
        user.token
    );

    // fetch performance logs
    const { isLoading: isPerfLogsLoading, error: isPerfLogsError, sendRequest: getPerfLogs } = useHttp(
        { url: "http://localhost:3000/api/performanceLog/" + ta.studentID },
        (data) => { setPerformanceLogs(data.logs) },
        user.token
    );

    // fetch student ratings
    const { isLoading: isRatingsLoading, error: isRatingsError, sendRequest: getRatings } = useHttp(
        { url: "http://localhost:3000/api/rating/" + ta.studentID },
        (data) => { setRatings(data.ratings) },
        user.token
    );

    const isLoading = isCohortLoading || isWishlistsLoading || isPerfLogsLoading || isRatingsLoading;
    const isError = isCohortError || isWishlistsError || isPerfLogsError || isRatingsError;

    React.useEffect(() => {
        // onload functions

        // set scroll listener
        document.addEventListener("scroll", () => {
            window.innerHeight + window.pageYOffset >= document.body.offsetHeight ? setIsAtBottom(true) : setIsAtBottom(false);
        });

        // fetch cohort info
        getCohortInfo();

        // fetch wishlists
        getWishlists();

        // fetch performance logs
        getPerfLogs();

        // fetch student ratings
        getRatings();
    }, []);

    const defaultData = "N/A";

    const fields = [
        { label: "Email", value: ta.email },
        { label: "Student ID", value: ta.studentID },
        { label: "Phone Number", value: isCohortError ? defaultData : taCohortInfo.phone },
        { label: "Degree", value: isCohortError ? defaultData : taCohortInfo.degree },
        { label: "Level", value: isCohortError ? defaultData : taCohortInfo.level },
        { label: "Priority", value: isCohortError ? defaultData : booleanToYesNo(taCohortInfo.priority) },
        { label: "Supervisor", value: isCohortError ? defaultData : taCohortInfo.supervisorName },
        { label: "Location", value: isCohortError ? defaultData : taCohortInfo.location },
        { label: "Date Applied", value: isCohortError ? defaultData : taCohortInfo.dateApplied },
        { label: "Courses Applied For", value: isCohortError ? defaultData : arrToString(taCohortInfo.coursesAppliedFor) },
        { label: "Open To Other Courses", value: isCohortError ? defaultData : booleanToYesNo(taCohortInfo.openToOtherCourses) },
        { label: "Hours", value: isCohortError ? defaultData : taCohortInfo.hours },
        { label: "Current Courses", value: arrToString(ta.currCourses) },
        { label: "Previous Courses", value: arrToString(ta.prevCourses) }
    ];

    const midPoint = Math.ceil(fields.length / 2);

    const wishlistMembershipTitle = (
        <>
            Professor Wishlists&nbsp;
            <OverlayTrigger placement='top'
                overlay={<Tooltip>These are the professors that have this TA on their wishlist.</Tooltip>}>
                <InfoOutlinedIcon fontSize='small' />
            </OverlayTrigger>
        </>
    );

    const hasPerformanceLogs = performanceLogs.length > 0;
    const hasStudentComments = ratings.length > 0;
    const hasWishlistMembership = wishlists.length > 0;

    return (
        <div className="taInfoContainer">
            <button className="btn btn-secondary" onClick={exitTAInfoView}>
                <ArrowBackRoundedIcon />
            </button>

            <Container className="mt-3 taInfo" style={{ marginBottom: "20px" }}>
                <div className="rowC">
                    <h2>
                        {ta.name}
                        {ta.name !== taCohortInfo.legalName && ` (${taCohortInfo.legalName})`}
                        &nbsp;
                    </h2>
                    <OverlayTrigger placement='top' overlay={<Tooltip>Student Rating Average</Tooltip>}>
                        <span style={{ alignSelf: "center", fontSize: "28px" }}>⭐⭐⭐⭐⭐</span>
                    </OverlayTrigger>
                </div>



                <TAInfoCard title="Cohort Information" style={{ width: '100%' }} maxHeight="fit-content" flexDirection="row">
                    <div className="cohortFields">
                        {fields.slice(0, midPoint).map((field, index) => (
                            <LabelledTextbox key={index} label={field.label} value={field.value !== "" ? field.value : "None"} />
                        ))}
                    </div>
                    <div className="cohortFields">
                        {fields.slice(midPoint).map((field, index) => (
                            <LabelledTextbox key={index} label={field.label} value={field.value} />
                        ))}
                    </div>
                </TAInfoCard>

                <TAInfoCard title={wishlistMembershipTitle}>
                    <div className="wishlistProfessors">
                        {hasWishlistMembership && wishlists.map(wishlist => (
                            <LabelledTextbox key={wishlist._id} value={wishlist.profName} />
                        ))}

                        {!hasWishlistMembership && "No professors have this student on their wishlist."}
                    </div>
                </TAInfoCard>

                <TAInfoCard title="Professor Performance Logs" centerText={!hasPerformanceLogs}>
                    {hasPerformanceLogs && performanceLogs.map(log => (
                        <LabelledTextbox key={log._id} label={`${log.profName} - ${log.courseNumber}`} value={log.comment} />
                    ))}

                    {!hasPerformanceLogs && "No performance logs found."}
                </TAInfoCard>

                <TAInfoCard title="Student Comments" centerText={!hasStudentComments} style={{ marginBottom: "20px" }}>
                    {hasStudentComments && ratings.map(rating => (
                        <LabelledTextbox key={rating._id} label={`${convertScoreToStars(rating.score)} - ${rating.courseNumber}`} value={rating.comment + ` - ${rating.authorName}`} />
                    ))}

                    {!hasStudentComments && "No student comments found."}
                </TAInfoCard>

                <TAActionsBar currCourses={ta.currCourses} modifyCurrCourses={(newCurrCourses) => modifyCurrCourses(ta.studentID, newCurrCourses)} isAtBottom={isAtBottom} />
            </Container>
        </div>
    );
};

export default TAInfo;