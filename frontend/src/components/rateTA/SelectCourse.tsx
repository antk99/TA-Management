import React, { useEffect, useState } from "react";
import { Course } from "../../classes/Course";
import { Container } from "react-bootstrap";
import CourseRowNoDesc from "./CourseRowNoDesc";
import { UserContext } from "../../App";
import getFullyQualifiedURL from "../../helpers/host";
import "../../style/rateTables.css";

const SelectCourse = props => {
    const [courses, setCourses] = useState<Array<Course> & any>([]);
    const [text, setText] = useState("loading...");
    const { user } = React.useContext(UserContext);

    const fetchCourseData = async () => {
        try {
            const res = await fetch(getFullyQualifiedURL("/api/student/courses/") + String(user.id), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
            });
            const data = await res.json();
            const courseObject = [];
            if(!data || !data.courses || data.courses.length < 1){
                setText("You are not enrolled in any courses");
                return;
            } 
            console.log(data);
            for (const d of data.courses) {
                let item: { [key: string]: any } = {
                    courseNumber: d.courseNumber,
                    courseName: d.courseName,
                    term: d.term,
                    year: d.year,
                    id: d._id
                }
                courseObject.push(item);
            }
            setCourses(courseObject);
        } catch (err) {
            setText("Error while fetching courses");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, []);

    return (
        <Container className="mt-3">
            { courses.length > 0 ?
            <><div className="rowC">
                <h2 style={{ marginBottom: "20px" }}>Select a Course</h2>
            </div>
            <div id="rateTable">
                <table>
                    <thead>
                        <tr>
                            <th className="column1">Course Number</th>
                            <th className="column2">Course Name</th>
                            <th className="column4">Course Semester</th>
                            <th className="column5">Course Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course: Course) => (
                            <CourseRowNoDesc course={course} setCourse={props.setSelectCourse} />
                        ))}
                    </tbody>
                </table>
            </div></>
            : <div className="rowC">
                <h2 style={{ marginBottom: "20px" }}>{text}</h2>
            </div>}
        </Container>
    );
};

export default SelectCourse;