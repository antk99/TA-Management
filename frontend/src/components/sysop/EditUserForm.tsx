import { useContext, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import React from "react";
import { Modal } from "react-bootstrap";
import "../../style/userTable.css";
import { UserTypes } from "../../enums/UserTypes";
import { UserContext } from "../../App";
import getFullyQualifiedUrl from "../../helpers/host";

function EditUserForm({ userToUpdate, fetchUserData, show, setShow }) {
  const { user } = useContext(UserContext);

  const [tempFirstname, setTempFirstname] = useState<string>(userToUpdate.firstName);
  const [tempLastname, setTempLastname] = useState<string>(userToUpdate.lastName);
  const [tempUserType, setTempUserType] = useState<Array<UserTypes>>(userToUpdate.userType);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(getFullyQualifiedUrl("/api/users/edit/" + userToUpdate.email), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", "Authorization": "Bearer " + user.token,
        },
        body: JSON.stringify({
          firstName: tempFirstname,
          lastName: tempLastname,
          userType: tempUserType,
        }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error);

      // Refresh the table
      setTimeout(() => {
        fetchUserData();
        setShow(false);
      }, 500);

    } catch (err) {
      alert(err.message);
    }
  };

  function handleCheckbox(e) {
    let existingUserTypes: UserTypes[] = [...tempUserType];
    if (e.target.checked) {
      existingUserTypes.push(e.target.value);
    } else {
      const index = existingUserTypes.indexOf(e.target.value);
      existingUserTypes.splice(index, 1);
    }
    setTempUserType(existingUserTypes);
  }

  return (
    <Modal show={show} onHide={() => setShow(false)}
      dialogClassName="modal-lg"
      aria-labelledby="example-custom-modal-styling-title">
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">Add a User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Control required type="firstName"
                placeholder="Enter the first name of the user"
                value={tempFirstname}
                onChange={(e) => setTempFirstname(e.target.value)} />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Control required type="lastName"
                placeholder="Enter the last name of the user"
                value={tempLastname}
                onChange={(e) => setTempLastname(e.target.value)} />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Check inline type="checkbox" label="Student" value="stud" onChange={handleCheckbox} checked={tempUserType.includes(UserTypes.Student)} />
              <Form.Check inline type="checkbox" label="Professor" value="prof" onChange={handleCheckbox} checked={tempUserType.includes(UserTypes.Professor)} />
              <Form.Check inline type="checkbox" label="TA" value="ta" onChange={handleCheckbox} checked={tempUserType.includes(UserTypes.TA)} />
              <Form.Check inline type="checkbox" label="Admin" value="admin" onChange={handleCheckbox} checked={tempUserType.includes(UserTypes.Admin)} />
              <Form.Check inline type="checkbox" label="Sysop" value="sysop" onChange={handleCheckbox} checked={tempUserType.includes(UserTypes.Sysop)} />
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

export default EditUserForm;
