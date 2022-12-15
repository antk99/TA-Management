import { Button, Dropdown, DropdownButton, Form, Modal } from "react-bootstrap";
import "../../style/taInfoPage.css";
import React from "react";
import { UserContext } from "../../App";
import { TA } from "../../classes/TA";
import { useHttp } from "../../hooks/useHttp";
import getFullyQualifiedURL from '../../helpers/host';

// from backend/src/models/Course.ts
const Terms = ["Fall", "Winter", "Summer"];

// TODO: add confirmation prompt for course removal
// TODO: add option to delete course from prevCourses

const TAActionsBar = ({ ta, modifyCurrCourses, isAtBottom }: { ta: TA, modifyCurrCourses: Function, isAtBottom: boolean }) => {
    const { user } = React.useContext(UserContext);
    const courseSearchInputRef = React.useRef<HTMLInputElement>();
    const [showCourseAddModal, setShowCourseAddModal] = React.useState<boolean>(false);
    const [courses, setCourses] = React.useState<any>([]);
    const [filteredCourses, setFilteredCourses] = React.useState<any>([]);

    const { isLoading, error, sendRequest: fetchCourses } = useHttp(
        { url: "/api/course" },
        (data) => {
            const coursesData = data.courses.map(course => course.courseNumber).sort();
            setCourses(coursesData);
            setFilteredCourses(coursesData);
        },
        user.token
    );

    const filterCourses = () => {
        const filter = courseSearchInputRef.current.value.toLowerCase();
        setFilteredCourses(courses.filter(
            course => course.toLowerCase().includes(filter)
        ));
    };

    React.useEffect(() => {
        // fetch courses
        fetchCourses();
    }, []);

    const handleCourseRemoval = async (course) => {
        // delete from db

        try {
            const response = await fetch(getFullyQualifiedURL("/api/ta/removeCurrCourse"), {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + user.token, "Content-Type": "application/json" },
                body: JSON.stringify({ taStudentID: ta.studentID, ...course })
            });
            const data = await response.json();

            if (!response.ok)
                throw new Error(data.error);

            // delete from state
            modifyCurrCourses(ta.studentID, ta.currCourses.filter(courseReg => courseReg.courseNumber !== data.courseRemoved));

        } catch (error) {
            alert(error.message)
        }
    };

    const addCourse = async (course) => {
        // add to db

        try {
            const response = await fetch(getFullyQualifiedURL("/api/ta/addCurrCourse"), {
                method: "POST",
                headers: { "Authorization": "Bearer " + user.token, "Content-Type": "application/json" },
                body: JSON.stringify({ taStudentID: ta.studentID, ...course })
            });
            const data = await response.json();

            if (!response.ok)
                throw new Error(data.error);

            // add to state
            modifyCurrCourses(ta.studentID, [...ta.currCourses, data.courseAdded]);

            // clear input
            if (courseSearchInputRef.current)
                courseSearchInputRef.current.value = ""

            setShowCourseAddModal(false);

        } catch (err) {
            alert(err.message);
        }
    };

    const handleAddCourseSubmit = (e) => {
        e.preventDefault();
        const data = e.target;
        const course = { courseNumber: data.courseNumber.value, term: data.term.value, termYear: data.termYear.value, assignedHours: data.assignedHours.value };
        addCourse(course);
    };

    // 5 years from now
    const todaysYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++)
        years.push(todaysYear + i);

    return (
        <>
            <div className={`taActionsBackdrop ${!isAtBottom && "realBackdrop"}`}></div>
            <div className="taActionsBackdrop containerBackdrop">
                <div className="taActionsBar">
                    <Button style={{ display: "flex", flexDirection: "row" }} variant="primary greenDropdown" onClick={() => setShowCourseAddModal(true)}>
                        Add To Course
                    </Button>
                    <DropdownButton variant="primary redDropdown" title="Remove From Course" disabled={ta.currCourses.length === 0}>
                        {ta.currCourses.map(course => {
                            return <Dropdown.Item onClick={() => handleCourseRemoval(course)} key={course.courseNumber}>{course.courseNumber}</Dropdown.Item>
                        })}
                    </DropdownButton>
                </div>
            </div>
            <Modal show={showCourseAddModal} onHide={() => setShowCourseAddModal(false)} dialogClassName="modal-md">
                <Modal.Header closeButton>
                    <Modal.Title>{`Add To Course`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleAddCourseSubmit}>
                        <Form.Group controlId="formCourseNumber" className="mb-3">
                            <Form.Label>Course Number</Form.Label>
                            {filterCourses.length > 50 && <Form.Control type="text" placeholder="Enter course number" ref={courseSearchInputRef} onChange={filterCourses} />}
                            <Form.Select required name="courseNumber">
                                {filteredCourses.map(c => <option key={c} value={c}>{c}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formAssignedHours" className="mb-3">
                            <Form.Label>Assigned Hours</Form.Label>
                            <Form.Select required name="assignedHours">
                                <option value={90}>90</option>
                                <option value={180}>180</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formTerm" className="mb-3">
                            <Form.Label>Term</Form.Label>
                            <Form.Select required name="term">
                                {Terms.map(term => <option key={term} value={term}>{term}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formTermYear" className="mb-3">
                            <Form.Label>Term Year</Form.Label>
                            <Form.Select required name="termYear">
                                {years.map(year => <option key={year} value={year}>{year}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary greenDropdown" type="submit">
                            Add To Course
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default TAActionsBar;