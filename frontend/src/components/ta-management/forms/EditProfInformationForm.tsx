import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import React from "react";
import { Edit } from "@mui/icons-material";
import { CourseContext } from "../ManageTAs";
import { OfficeHour } from "../../../classes/OfficeHour";
import OfficeHoursForm from "./OfficeHoursForm";

function EditProfInformationForm({ instructor }) {
  const [show, setShow] = useState(false);
  const [tempEmail, setTempEmail] = useState<string>();
  const [tempFullname, setTempFullname] = useState<string>();
  const [tempOfficeHours, setTempOfficeHours] = useState<Array<OfficeHour>>([]);

  const { course, fetchCourseData } = React.useContext(CourseContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log(tempOfficeHours)
      const res = await fetch(`http://127.0.0.1:3000/api/course/${course.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...course,
          instructorOfficeHours: tempOfficeHours,
        }),
      });
      console.log(res)
      if (res.status === 204) {
        setTimeout(() => {
          fetchCourseData();
          setShow(false)
        }, 500)
      } else {
        alert("Error while updating the TA informations.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTempEmail(instructor.email);
    setTempFullname(instructor.name);
    setTempOfficeHours(instructor.officeHours);
  }, [instructor]);

  const updateOfficeHourField = (index: number, field: string, value: string) => {
    const updatedOfficeHours = tempOfficeHours.map((officeHour, i) => {
      if (i === index) {
        return {
          ...officeHour,
          [field]: value,
        };
      }
      return officeHour;
    });
    setTempOfficeHours(updatedOfficeHours);
  };

  return (
    <div>
      <button className="courses" onClick={() => setShow(true)}>
        <Edit fontSize="small" /> Edit information
      </button>

      <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-lg" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">Edit TA informations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control disabled required type="email" placeholder="TA Email" value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Label>Full name</Form.Label>
                  <Form.Control disabled required type="fullname" placeholder="TA full name" value={tempFullname} onChange={(e) => setTempFullname(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <OfficeHoursForm officeHours={tempOfficeHours} setOfficeHours={setTempOfficeHours} />
              </Col>
            </Row>
            <Button className="mt-3" variant="light" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EditProfInformationForm;
