import { useContext, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import React from "react";
import "../../style/userTable.css";
import { UserContext } from "../../App";
import getFullyQualifiedUrl from "../../helpers/host";

function EditProfForm({ profToEdit, fetchProfData, show, setShow }) {
  const { user } = useContext(UserContext);

  const [tempFaculty, setTempFaculty] = useState<string>("Science");
  const [tempDept, setTempDept] = useState<string>("Computer Science");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(getFullyQualifiedUrl("/api/prof/edit/" + profToEdit.email), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", "Authorization": "Bearer " + user.token,
        },
        body: JSON.stringify({
          faculty: tempFaculty,
          department: tempDept,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }

      // Refresh the table
      setTimeout(() => {
        fetchProfData();
        setShow(false);
      }, 500);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-lg" aria-labelledby="example-custom-modal-styling-title">
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">Edit {`${profToEdit.firstName} ${profToEdit.lastName}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Select required onChange={(e) => setTempFaculty(e.target.value)}>
                <option value="">Select a Faculty...</option>
                <option value="Science">Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Arts">Arts</option>
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Select required onChange={(e) => setTempDept(e.target.value)}>
                <option value="">Select a Department...</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
              </Form.Select>
            </Col>
          </Row>
          <Button className="mt-3" variant="light" type="submit">
            Confirm
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditProfForm;
