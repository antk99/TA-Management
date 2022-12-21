import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "../../style/userTable.css";
import { UserContext } from "../../App";
import getFullyQualifiedUrl from "../../helpers/host";

const EditCourseQuotaForm = ({ quotaToEdit, fetchCourseData, show, setShow }) => {
  const { user } = React.useContext(UserContext);

  const [taQuota, setTAQuota] = React.useState(quotaToEdit.taQuota);
  const [enrollmentNumber, setEnrollmentNumber] = React.useState(quotaToEdit.enrollmentNumber);

  const handleEditCourse = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(getFullyQualifiedUrl("/api/courseQuota/edit/" + quotaToEdit._id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", "Authorization": "Bearer " + user.token
        },
        body: JSON.stringify({
          taQuota,
          enrollmentNumber,
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
        <Modal.Title id="example-custom-modal-styling-title">Edit {quotaToEdit.courseNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleEditCourse}>

          <Row>
            <Col>
              <Form.Control required type="taQuota" placeholder="Please enter the TA quota." value={taQuota} onChange={(e) => setTAQuota(e.target.value)} />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Control required type="enrollmentNumber" placeholder="Please enter the enrollment number." value={enrollmentNumber} onChange={(e) => setEnrollmentNumber(e.target.value)} />
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

export default EditCourseQuotaForm;
