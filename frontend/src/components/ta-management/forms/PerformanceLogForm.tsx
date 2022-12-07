import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import React from "react";
import "../../../style/userTable.css";
import { CourseContext } from "../ManageTAs";
import { fetchPerformanceLogByTa } from "../../../helpers/fetchPerformanceLogs";
import { PerformanceLog } from "../../../classes/PerformanceLog";

function PerformanceLogForm({ ta }) {
  const [show, setShow] = useState(false);
  const [tempLog, setTempLog] = useState<string>();
  const [performanceLogs, setPerformanceLogs] = useState<PerformanceLog[]>([]);

  const { course } = React.useContext(CourseContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://127.0.0.1:3000/api/performanceLog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ta: ta.uuid,
          course: course.id,
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
    const data = await fetchPerformanceLogByTa(ta.uuid);
    setPerformanceLogs(data.performanceLog);
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
            <Card className="mt-3" key={i}>
              <Card.Body>
                <Card.Subtitle className="mb-2 text-muted">{log.course_num}</Card.Subtitle>
                <Card.Text>{log.comment}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PerformanceLogForm;
