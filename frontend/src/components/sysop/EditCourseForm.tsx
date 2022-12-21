import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "../../style/userTable.css";
import { UserContext } from "../../App";
import getFullyQualifiedUrl from "../../helpers/host";

// Form that edits a course
const EditCourseForm = ({ courseToEdit, fetchCourseData, show, setShow }) => {
  const { user } = React.useContext(UserContext);

  const [courseDesc, setCourseDesc] = React.useState(courseToEdit.courseDesc);
  const [courseNumber, setCourseNumber] = React.useState(courseToEdit.courseNumber);
  const [courseName, setCourseName] = React.useState(courseToEdit.courseName);
  const [term, setTerm] = React.useState(courseToEdit.term);
  const [year, setYear] = React.useState(courseToEdit.year);
  const [instructorEmail, setInstructorEmail] = React.useState(courseToEdit.instructorEmail);

  const handleEditCourse = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(getFullyQualifiedUrl("/api/course/editDetails/" + courseToEdit._id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", "Authorization": "Bearer " + user.token
        },
        body: JSON.stringify({
          courseDesc: courseDesc,
          courseNumber: courseNumber,
          courseName: courseName,
          term: term,
          year: year,
          instructorEmail: instructorEmail
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Something went wrong, please try again.");

      setTimeout(() => {
        fetchCourseData();
        setShow(false);
      }, 500);

    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-lg" aria-labelledby="example-custom-modal-styling-title">
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">Edit {courseToEdit.courseNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleEditCourse}>

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
              <Form.Control required type="email" placeholder="Please enter Course Instructor's Email." value={instructorEmail} onChange={(e) => setInstructorEmail(e.target.value)} />
            </Col>
          </Row>


          <Button className="mt-3" variant="light" type="submit">
            Confirm
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditCourseForm;
