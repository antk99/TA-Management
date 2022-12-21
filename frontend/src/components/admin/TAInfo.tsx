import React from 'react';
import { Container } from 'react-bootstrap';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import '../../style/taInfoPage.css';
import TAActionsBar from './TAActionsBar';
import { UserContext } from '../../App';
import { useHttp } from '../../hooks/useHttp';
import getFullyQualifiedUrl from '../../helpers/host';
import TAInfoTitleSection from './TAInfoTitleSection';
import TAInfoCohortSection from './TAInfoCohortSection';
import TAInfoOfficeHoursSection from './TAInfoOfficeHoursSection';
import TAInfoWishlistSection from './TAInfoWishlistSection';
import TAInfoPerformanceLogSection from './TAInfoPerformanceLogSection';
import TAInfoRatingsSection from './TAInfoRatingsSection';

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

const TAInfo = ({ ta, exitTAInfoView, modifyCurrCourses }) => {
    const [isAtBottom, setIsAtBottom] = React.useState<boolean>(false);
    const { user } = React.useContext(UserContext);
    const [cohortInfo, setCohortInfo] = React.useState<any>({});
    const [officeHours, setOfficeHours] = React.useState<any>([]);
    const [wishlists, setWishlists] = React.useState<any>([]);
    const [performanceLogs, setPerformanceLogs] = React.useState<any>([]);
    const [ratings, setRatings] = React.useState<any>([]);

    // fetch cohort info
    const { isLoading: isCohortLoading, error: isCohortError, sendRequest: getCohortInfo } = useHttp(
        { url: "/api/cohort/" + ta.studentID },
        (data) => { setCohortInfo(data.cohortInfo) },
        user.token
    );

    // fetch office hours
    const { isLoading: isOHLoading, error: isOHError, sendRequest: getOfficeHours } = useHttp(
        { url: "/api/users/email/" + ta.email },
        async (data) => {
            const taUserID = data.user._id;
            const request = await fetch(getFullyQualifiedUrl("/api/course/ta/" + taUserID),
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
        { url: "/api/wishlist/ta/" + ta.studentID },
        (data) => { setWishlists(data.wishlist) },
        user.token
    );

    // fetch performance logs
    const { isLoading: isPerfLogsLoading, error: isPerfLogsError, sendRequest: getPerfLogs } = useHttp(
        { url: "/api/performanceLog/" + ta.studentID },
        (data) => { setPerformanceLogs(data.logs) },
        user.token
    );

    // fetch student ratings
    const { isLoading: isRatingsLoading, error: isRatingsError, sendRequest: getRatings } = useHttp(
        { url: "/api/rating/" + ta.studentID },
        (data) => { setRatings(data.ratings) },
        user.token
    );

    // TODO: Use these to display error/loading messages
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

    const averageScore: number = (Math.round(calcAverageScore(ratings) * 10) / 10); // round to 1 decimal place

    return (
        <div className="taInfoContainer">
            <button className="btn btn-secondary" onClick={exitTAInfoView}>
                <ArrowBackRoundedIcon />
            </button>

            <Container className="mt-3 taInfo" style={{ marginBottom: "20px" }}>
                <TAInfoTitleSection name={ta.name} legalName={cohortInfo?.legalName} averageScore={averageScore} />

                <TAInfoCohortSection ta={ta} cohortInfo={cohortInfo} isError={isCohortError} />

                <div style={{ display: "flex", gap: "20px" }}>
                    <TAInfoOfficeHoursSection officeHours={officeHours} />

                    <TAInfoWishlistSection wishlists={wishlists} />
                </div>

                <TAInfoPerformanceLogSection performanceLogs={performanceLogs} />

                <TAInfoRatingsSection ratings={ratings} />

                <TAActionsBar ta={ta} modifyCurrCourses={modifyCurrCourses} isAtBottom={isAtBottom} />
            </Container>
        </div>
    );
};

export default TAInfo;