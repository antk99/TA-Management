import { Button, Dropdown, DropdownButton, Form, Modal } from "react-bootstrap";
import "../../style/taInfoPage.css";
import React from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { UserContext } from "../../App";
import { TA } from "../../classes/TA";
import AdminButton from "./AdminButton";
import { useHttp } from "../../hooks/useHttp";
import { Term } from "../../../../backend/src/models/Course";

// from backend/src/models/Course.ts
const Terms = ["Fall", "Spring", "Summer"];

// TODO: add confirmation prompt for course removal

const TAActionsBar = ({ ta, modifyCurrCourses, isAtBottom }: { ta: TA, modifyCurrCourses: Function, isAtBottom: boolean }) => {
    const { user } = React.useContext(UserContext);
    const courseSearchInputRef = React.useRef<HTMLInputElement>();
    const [showCourseAddModal, setShowCourseAddModal] = React.useState<boolean>(false);
    const [courses, setCourses] = React.useState<any>([]);
    const [filteredCourses, setFilteredCourses] = React.useState<any>([]);

    const { isLoading, error, sendRequest: fetchCourses } = useHttp(
        { url: "http://localhost:3000/api/course" },
        (data) => { setCourses(data.courses.map(course => course.courseNumber)) },
        user.token
    );

    const filterCourses = () => {
        setFilteredCourses(courses.filter(
            course => course.toLowerCase().includes(courseSearchInputRef.current.value.toLowerCase())
        ));
    };

    React.useEffect(() => {
        // fetch courses
        fetchCourses();
    }, []);

    const handleCourseRemoval = async (course) => {
        // delete from db
        const response = await fetch("http://localhost:3000/api/ta/removeCurrCourse", {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + user.token, "Content-Type": "application/json" },
            body: JSON.stringify({ taStudentID: ta.studentID, ...course })
        });

        if (!response.ok)
            throw new Error("Could not remove course.");
        else {
            // delete from state
            const data = await response.json();
            modifyCurrCourses(ta.studentID, ta.currCourses.filter(courseReg => courseReg.courseNumber !== data.courseRemoved));
        }
    };

    const addCourse = async (course) => {
        // add to db
        const response = await fetch("http://localhost:3000/api/ta/addCurrCourse", {
            method: "POST",
            headers: { "Authorization": "Bearer " + user.token, "Content-Type": "application/json" },
            body: JSON.stringify({ taStudentID: ta.studentID, ...course })
        });

        if (!response.ok)
            throw new Error("Could not add course.");
        else {
            // add to state
            const data = await response.json();
            modifyCurrCourses(ta.studentID, [...ta.currCourses, data.courseAdded]);

            // clear input
            courseSearchInputRef.current.value = "";
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
                    <AdminButton style={{ display: "flex", flexDirection: "row" }} color="green" onClick={() => setShowCourseAddModal(true)}>
                        Add To Course
                    </AdminButton>
                    <DropdownButton variant="primary redDropdown" title="Remove From Course">
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
                            <Form.Control type="text" placeholder="Enter course number" ref={courseSearchInputRef} onChange={filterCourses} />
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

                        <Button variant="outline-secondary" type="submit">
                            Add To Course
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default TAActionsBar;