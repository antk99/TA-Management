import React from 'react';
import { Container } from 'react-bootstrap';
import ImportForm from '../sysop/ImportForm';

const CourseQuota = props => {

    // TODO: get course quota data from backend
    // TODO: add import form

    return (
        <>
            <ImportForm taskName="Course Quota" uploadUrl="http://127.0.0.1:3000/api/users/upload" />
            <Container className="mt-3">
                <div className="rowC">
                    <h2 style={{ marginBottom: "20px" }}>Course Quota</h2>
                </div>

                <div id="taCourseInfoTable">
                    <table>
                        <thead>
                            <tr>
                                <th className="column1">Course Number</th>
                                <th className="column2">Course Name</th>
                                <th className="column3">Term Year</th>
                                <th className="column4">Course Type</th>
                                <th className="column5">Instructor</th>
                                <th className="column6">Enrollment Number</th>
                                <th className="column7">TA Quota</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="column1">CSC108H1</td>
                                <td className="column2">Introduction to Computer Programming</td>
                                <td className="column3">2020</td>
                                <td className="column4">Lecture</td>
                                <td className="column5">John Doe</td>
                                <td className="column6">100</td>
                                <td className="column7">10</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Container>
        </>
    );
};

export default CourseQuota;