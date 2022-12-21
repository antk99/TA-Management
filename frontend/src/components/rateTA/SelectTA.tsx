import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { TA } from "../../classes/TA";
import TARow from "./TARow";
import { UserContext } from "../../App";
import getFullyQualifiedURL from "../../helpers/host";
import "../../style/rateTables.css";

const SelectTA = props => {
    const [TAs, setTAs] = useState([]);
    const [text, setText] = useState("loading...");
    const { user } = React.useContext(UserContext);

    const fetchUserData = async () => {
        try {
            const res = await fetch(getFullyQualifiedURL("/api/course/allTas/") + props.courseId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
            });
            const result = await res.json();
            if (!result || !result.TAs || result.TAs.length < 1) {
                setText("No TAs are currently registered for this course");
                return;
            }
            setTAs(result.TAs);
        } catch (err) {
            setText("Error occurred while fetching TAs");
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <Container className="mt-3">
            {TAs.length > 0 ? <>
                <div className="rowC">
                    <h2 style={{ marginBottom: "20px" }}>{props.courseCode + " " + props.courseTerm + " " + props.courseYear} TAs</h2>
                </div>
                <div id="rateTable">
                    <table>
                        <tbody>
                            {TAs.map((ta, i: number) => {
                                if (ta) {
                                    return <TARow key={i}
                                        TA={ta}
                                        courseCode={props.courseCode}
                                        courseTerm={props.courseTerm}
                                        courseYear={props.courseYear}
                                    />;
                                }
                                return null;
                            })}
                        </tbody>
                    </table>
                </div>
            </> : <div className="rowC">
                    <h2 style={{ marginBottom: "20px" }}>{text}</h2>
                </div>
            }
            <div className="links" style={{ textDecoration: "underline", paddingBottom: "20px", paddingTop: "40px", maxWidth: "30px" }}
                onClick={() => { props.setSelectCourse("") }}>
                back
            </div>
        </Container>
    );
};

export default SelectTA;