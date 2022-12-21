import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import "../../../style/userTable.css";
import { Edit } from "@mui/icons-material";
import { CourseContext } from "../ManageTAs";
import { OfficeHour } from "../../../classes/OfficeHour";
import OfficeHoursForm from "./OfficeHoursForm";
import { UserContext } from "../../../App";
import DutiesForm from "./DutiesForm";
import { Duties } from "../../../classes/Duties";
import getFullyQualifiedUrl from "../../../helpers/host";

function EditTAInformationForm({ ta }) {
  const [show, setShow] = useState(false);
  const [tempEmail, setTempEmail] = useState<string>();
  const [tempFullname, setTempFullname] = useState<string>();
  const [tempResponsabilities, setTempResponsabilities] = useState<Array<string>>([]);
  const [tempOfficeHours, setTempOfficeHours] = useState<Array<OfficeHour>>([]);
  const [tempDuties, setTempDuties] = useState<Duties>(null);

  const { course, fetchCourseData } = React.useContext(CourseContext);
  const { user } = React.useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedCourseTAs = course.courseTAs.map((courseTA) => {
      return {
        uuid: courseTA.uuid,
        studentID: courseTA.studentID,
        responsabilities: courseTA.uuid === ta.uuid ? tempResponsabilities : courseTA.responsabilities,
        officeHours: courseTA.uuid === ta.uuid ? tempOfficeHours : courseTA.officeHours,
        duties: courseTA.uuid === ta.uuid ? tempDuties : courseTA.duties,
      }
    });

    try {
      const res = await fetch(getFullyQualifiedUrl(`/api/course/edit/${course.id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + user.token,
        },
        body: JSON.stringify({
          ...course,
          courseTAs: updatedCourseTAs,
        }),
      });
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
    setTempEmail(ta.email);
    setTempFullname(ta.fullName);
    setTempResponsabilities(ta.responsabilities);
    setTempOfficeHours(ta.officeHours);
    setTempDuties(ta.duties);
  }, [ta]);

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
                <Form.Group className="mb-2" controlId="formBasicEmail">
                  <Form.Label>Responsabilities</Form.Label>
                  {tempResponsabilities.map((responsability, index) => (
                    <InputGroup className="mb-2" key={index}>
                      <Form.Control
                        required
                        type="responsability"
                        placeholder="Responsability"
                        value={responsability}
                        onChange={(e) => {
                          const newResponsabilities = [...tempResponsabilities];
                          newResponsabilities[index] = e.target.value;
                          setTempResponsabilities(newResponsabilities);
                        }}
                      />
                      <Button
                        variant="danger"
                        onClick={() => {
                          const newResponsabilities = [...tempResponsabilities];
                          newResponsabilities.splice(index, 1);
                          setTempResponsabilities(newResponsabilities);
                        }}
                      >
                        Remove
                      </Button>
                    </InputGroup>
                  ))}
                  <Button variant="light" onClick={() => setTempResponsabilities([...tempResponsabilities, ""])}>
                    <AddIcon fontSize="small" /> Add responsability
                  </Button>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <OfficeHoursForm officeHours={tempOfficeHours} setOfficeHours={setTempOfficeHours} />
              </Col>
            </Row>
            <Row>
              <Col>
                <DutiesForm duties={tempDuties} setDuties={setTempDuties} />
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

export default EditTAInformationForm;
