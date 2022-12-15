import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import "../../style/userTable.css";
import { UserContext } from "../../App";
import getFullyQualifiedUrl from "../../helpers/host";

// Form that adds a course with fields: courseCode, courseNumber, courseName, term, year
const AddCourseForm = ({ fetchCourseData }) => {
  const { user } = React.useContext(UserContext);

  const [show, setShow] = React.useState(false);
  const [courseDesc, setCourseDesc] = React.useState("");
  const [courseNumber, setCourseNumber] = React.useState("");
  const [courseName, setCourseName] = React.useState("");
  const [term, setTerm] = React.useState("");
  const [year, setYear] = React.useState("");
  const [instructor, setInstructor] = React.useState("");

  const handleAddCourse = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(getFullyQualifiedUrl("/api/course/add"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json", "Authorization": "Bearer " + user.token
        },
        body: JSON.stringify({
          courseDesc: courseDesc,
          courseNumber: courseNumber,
          courseName: courseName,
          term: term,
          year: year,
          instructorEmail: instructor
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Something went wrong, please try again.");

      // Reset form
      setCourseDesc("");
      setCourseNumber("");
      setCourseName("");
      setTerm("");
      setYear("");
      setInstructor("");

      setTimeout(() => {
        fetchCourseData();
        setShow(false);
      }, 500);

    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <button className="mb-4 mt-2" onClick={() => setShow(true)}>
        <AddIcon />
      </button>

      <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-lg" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">Add a Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCourse}>

            <Row>
              <Col>
                <Form.Control required type="courseNumber" placeholder="Please enter the course number." value={courseNumber} onChange={(e) => setCourseNumber(e.target.value)} />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Control required type="courseName" placeholder="Please enter the course name." value={courseName} onChange={(e) => setCourseName(e.target.value)} />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Control required type="courseDesc" placeholder="Please enter the course description." value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Control required type="term" placeholder="Please enter the course term." value={term} onChange={(e) => setTerm(e.target.value)} />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Control required type="year" placeholder="Please enter the course year." value={year} onChange={(e) => setYear(e.target.value)} />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Control required type="email" placeholder="Please enter Course Instructor's Email." value={instructor} onChange={(e) => setInstructor(e.target.value)} />
              </Col>
            </Row>


            <Button className="mt-3" variant="light" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddCourseForm;
