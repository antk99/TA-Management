import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { UserContext } from '../../App';
import { useHttp } from '../../hooks/useHttp';
import ImportForm from '../sysop/ImportForm';
import CourseQuotaRow from './courseQuotaRow';

const CourseQuota = () => {
    const { user } = useContext(UserContext);
    const [courseQuotas, setCourseQuotas] = React.useState([]);

    // TODO: get course quota data from backend
    const { isLoading, error, sendRequest: fetchCourseQuotas } = useHttp(
        { url: "http://localhost:3000/api/courseQuota" },
        (data) => { setCourseQuotas(data.quotas) },
        user.token
    );

    React.useEffect(() => {
        fetchCourseQuotas();
    }, []);

    return (
        <>
            <ImportForm taskName="Course Quota" uploadUrl="http://127.0.0.1:3000/api/courseQuota/upload" />
            <Container className="mt-3">
                <div className="rowC">
                    <h2 style={{ marginBottom: "20px" }}>Course Quota</h2>
                </div>

                <div id="taCourseInfoTable">
                    <table>
                        <thead>
                            <tr>
                                <th className="column0"></th>
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
                            {courseQuotas.map(course => (
                                <CourseQuotaRow key={`${course.courseNumber}${course.termYear}${course.courseType}${course.instructorName}`} course={course} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </Container>
        </>
    );
};

export default CourseQuota;