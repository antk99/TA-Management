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
import { courseRegArrayToString } from '../../classes/TA';

const booleanToYesNo = (bool) => { return bool ? "Yes" : "No" };
const arrToString = (arr) => { return arr ? arr.length === 0 ? "None" : arr.join(", ") : "" };
const convertScoreToStars = (score) => { return "⭐".repeat(score) }

// calculates average score for each author, then averages all averages
const calcAverageScore = (ratings) => {
    // group ratings by authorID
    const groupedRatings = {};
    ratings.forEach(rating => {
        if (groupedRatings[rating.authorID])
            groupedRatings[rating.authorID].push(rating);
        else
            groupedRatings[rating.authorID] = [rating];
    });

    // calculate average score for each author
    const avgScores = [];
    for (const authorID in groupedRatings) {
        const currRatings = groupedRatings[authorID];
        const avgScore = currRatings.reduce((acc, curr) => acc + curr.score, 0) / currRatings.length;
        avgScores.push(avgScore);
    }

    // calculate average of all averages
    return avgScores.reduce((acc, curr) => acc + curr, 0) / avgScores.length;
};

// TODO: implement office hours display

const TAInfo = ({ ta, exitTAInfoView, modifyCurrCourses }) => {
    const [isAtBottom, setIsAtBottom] = React.useState<boolean>(false);
    const { user } = React.useContext(UserContext);
    const [taCohortInfo, setTACohortInfo] = React.useState<any>({});
    const [officeHours, setOfficeHours] = React.useState<any>([]);
    const [wishlists, setWishlists] = React.useState<any>([]);
    const [performanceLogs, setPerformanceLogs] = React.useState<any>([]);
    const [ratings, setRatings] = React.useState<any>([]);

    // fetch cohort info
    const { isLoading: isCohortLoading, error: isCohortError, sendRequest: getCohortInfo } = useHttp(
        { url: "http://localhost:3000/api/cohort/" + ta.studentID },
        (data) => { setTACohortInfo(data.cohortInfo) },
        user.token
    );

    // fetch office hours
    const { isLoading: isOHLoading, error: isOHError, sendRequest: getOfficeHours } = useHttp(
        { url: "http://localhost:3000/api/users/email/" + ta.email },
        async (data) => {
            const taUserID = data.user._id;
            const request = await fetch("http://localhost:3000/api/course/ta/" + taUserID,
                { 'headers': { 'Authorization': 'Bearer ' + user.token, 'Content-Type': 'application/json' } }
            );
            const response = await request.json();
            const tasAllCourses = response.courses.map(course => ({ courseNumber: course.courseNumber, tas: course.courseTAs }));
            const temp = [];

            for (const tasCourse of tasAllCourses) {
                for (const ta of tasCourse.tas) {
                    if (ta.uuid === taUserID)
                        temp.push(ta.officeHours);
                }
            }
            setOfficeHours(temp.flat());
        },
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

    const isLoading = isCohortLoading || isWishlistsLoading || isPerfLogsLoading || isRatingsLoading || isOHLoading;
    const isError = isCohortError || isWishlistsError || isPerfLogsError || isRatingsError || isOHError;

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

        // fetch office hours
        getOfficeHours();
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
        { label: "Current Courses", value: courseRegArrayToString(ta.currCourses) },
        { label: "Previous Courses", value: courseRegArrayToString(ta.prevCourses) }
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
    const hasOfficeHours = officeHours.length > 0;
    const hasWishlistMembership = wishlists.length > 0;

    const averageScore = (Math.round(calcAverageScore(ratings) * 10) / 10).toFixed(1); // round to 1 decimal place

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
                    <OverlayTrigger placement='top' overlay={<Tooltip>Student Rating Average {`(${averageScore})`}</Tooltip>}>
                        <span style={{ alignSelf: "center", fontSize: "28px" }}>{convertScoreToStars(averageScore)}</span>
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

                <div style={{ display: "flex", gap: "20px" }}>
                    <TAInfoCard title="TA Office Hours" style={{ width: '50%' }}>
                        <div className="wishlistProfessors">
                            {hasOfficeHours && officeHours.map(officeHour => (
                                <LabelledTextbox key={officeHour.day + " " + officeHour.startTime}
                                    label={officeHour.day}
                                    value={`${officeHour.location} from ${officeHour.startTime} to ${officeHour.endTime}`} />
                            ))}

                            {!hasOfficeHours && "No office hours have been set for this TA."}
                        </div>
                    </TAInfoCard>

                    <TAInfoCard title={wishlistMembershipTitle} style={{ width: '50%' }}>
                        <div className="wishlistProfessors">
                            {hasWishlistMembership && wishlists.map(wishlist => (
                                <LabelledTextbox key={wishlist._id} value={wishlist.profName} />
                            ))}

                            {!hasWishlistMembership && "No professors have this student on their wishlist."}
                        </div>
                    </TAInfoCard>
                </div>

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

                <TAActionsBar ta={ta} modifyCurrCourses={modifyCurrCourses} isAtBottom={isAtBottom} />
            </Container>
        </div>
    );
};

export default TAInfo;