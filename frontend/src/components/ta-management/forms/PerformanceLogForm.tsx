import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import React from "react";
import "../../../style/userTable.css";
import { CourseContext } from "../ManageTAs";
import { fetchPerformanceLogByTa } from "../../../helpers/fetchPerformanceLogs";
import { PerformanceLog } from "../../../classes/PerformanceLog";
import LabelledTextbox from "../../admin/LabelledTextbox";
import { UserContext } from "../../../App";

function PerformanceLogForm({ ta }) {
  const [show, setShow] = useState(false);
  const [tempLog, setTempLog] = useState<string>();
  const [performanceLogs, setPerformanceLogs] = useState<PerformanceLog[]>([]);

  const { course } = React.useContext(CourseContext);
  const { user } = React.useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://127.0.0.1:3000/api/performanceLog/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + user.token,
        },
        body: JSON.stringify({
          taStudentID: ta.uuid,
          courseNumber: course.courseNumber,
          term: course.term,
          profEmail: course.instructorEmail,
          comment: tempLog
        }),
      });
      if (res.status === 201) {
        setTimeout(() => {
          loadPerformanceLog();
        }, 500)
      } else {
        alert("Error while updating the TA informations.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadPerformanceLog = async () => {
    console.log('LOADING')
    const data = await fetchPerformanceLogByTa(course.instructorEmail, ta.uuid, user.token);
    setPerformanceLogs(data.performanceLogs);
  }

  useEffect(() => {
    if(ta) {
      loadPerformanceLog();
    }
  }, [ta]);

  return (
    <div>
      <Button className="courses mt-3" onClick={() => setShow(true)}>
        View the log
      </Button>

      <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-lg" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">{ta?.fullName ?? ''}'s performance log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="bg-light">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group className="mb-2" controlId="formBasicEmail">
                      <Form.Label>Add a new comment</Form.Label>
                      <Form.Control as="textarea" rows={3} required type="performanceLog" value={tempLog} onChange={(e) => setTempLog(e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>
                <Button className="mt-3" variant="primary" type="submit">
                  Add comment
                </Button>
              </Form>
            </Card.Body>
          </Card>
          {performanceLogs && performanceLogs.map((log, i) => (
              <LabelledTextbox key={i} label={log.courseNumber} value={log.comment} styles={{ marginTop: 10 }}/>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PerformanceLogForm;
