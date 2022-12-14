import React, { useContext } from "react";
import { UserContext } from "../../App";
import { TA } from "../../classes/TA";
import { useHttp } from "../../hooks/useHttp";
import TACourseHistory from "./TACourseHistory";
import TAInfo from "./TAInfo";

const TAAdmin = () => {
    // stores the studentID of the TA that is currently being viewed (TAInfo)
    // if no TA is being viewed, this is set to null --> display list of all TAs (TACourseHistory)
    const [studentID, setStudentID] = React.useState<string>("");
    const { user } = useContext(UserContext);
    const [TAs, setTAs] = React.useState<Array<TA>>([]);

    const { isLoading, error, sendRequest: fetchAllTAs } = useHttp(
        { url: "http://localhost:3000/api/ta" },
        (data) => { setTAs(data.TAs.sort((a, b) => a.name.localeCompare(b.name))) },
        user.token
    );

    React.useEffect(() => {
        // Load data
        fetchAllTAs();
    }, []);

    const modifyCurrCourses = (studentID, newCurrCourses) => {

        let courseRemoved;

        // if course was removed, find which one
        TAs.find(ta => ta.studentID === studentID).currCourses.forEach(course => {
            if (!newCurrCourses.find(newCourse => newCourse.courseNumber === course.courseNumber))
                courseRemoved = course;
        });

        // update state
        if (courseRemoved) { // course was removed, add to prevCourses
            setTAs(prevTAs => prevTAs.map((ta) => (studentID === ta.studentID) ?
                { ...ta, currCourses: newCurrCourses, prevCourses: [...ta.prevCourses, courseRemoved] } : ta));
        } else { // course was added
            setTAs(prevTAs => prevTAs.map((ta) => (studentID === ta.studentID) ?
                { ...ta, currCourses: newCurrCourses } : ta));
        }
    };

    return (
        <>
            {
                studentID ?
                    <TAInfo modifyCurrCourses={modifyCurrCourses} ta={TAs.find(ta => ta.studentID === studentID)} exitTAInfoView={() => setStudentID("")} /> :
                    <TACourseHistory TAs={TAs} focusStudent={setStudentID} fetchData={fetchAllTAs} />
            }
        </>
    );
};

export default TAAdmin;