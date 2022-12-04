import React from "react";
import { TA } from "../../classes/TA";
import TACourseHistory from "./TACourseHistoryTable";
import TAInfo from "./TAInfo";

const dummyTA = {
    name: "John Doe",
    email: "johndoe@email.com",
    studentID: "123456789",
    legalName: "John Bob Doe",
    level: "Undergraduate",
    supervisorName: "John Doe",
    isPriority: true,
    hours: 20,
    dateApplied: "2021-01-01",
    location: "Online",
    phone: "1234567890",
    degree: "BSc",
    coursesAppliedFor: ["CSC108", "CSC148"],
    openToOtherCourses: true,
    notes: "This a note for TA John Doe",
    currCourses: ["CSC108", "CSC148", "CSC209"],
    prevCourses: ["CSC207", "CSC236", "CSC258"]
};

const dummyTA2 = { ...dummyTA, name: "Jane Doe", email: "JaneDoe@mail.mcgill.ca", studentID: "987654321", currCourses: ["COMP 302", "COMP 307", "COMP 303"] };

const TAAdmin = () => {
    // stores the studentID of the TA that is currently being viewed (TAInfo)
    // if no TA is being viewed, this is set to null --> display list of all TAs (TACourseHistory)
    const [studentID, setStudentID] = React.useState<string>("");

    const [TAs, setTAs] = React.useState<Array<TA>>([
        dummyTA, dummyTA2, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA2, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA2, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA, dummyTA,
    ]);

    const fetchAllTAs = async () => {
        try {
            // const res = await fetch("http://127.0.0.1:3000/api/tas");
            // const json = await res.json();
            // setTAs(json.TAs);
        } catch (err) {
            console.log(err);
        }
    };

    const modifyTACurrCourses = (studentID, newCurrCourses) => {
        setTAs(TAs.map((ta) => (studentID === ta.studentID ? { ...ta, currCourses: newCurrCourses } : ta)));
    };

    React.useEffect(() => {
        // Load data
        fetchAllTAs();
    }, []);

    return (
        <>
            {
                studentID ?
                    <TAInfo modifyCurrCourses={modifyTACurrCourses} ta={TAs.find(ta => ta.studentID === studentID)} exitTAInfoView={() => setStudentID("")} /> :
                    <TACourseHistory TAs={TAs} focusStudent={setStudentID} />
            }
        </>
    );
};

export default TAAdmin;