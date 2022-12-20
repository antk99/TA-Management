import { useEffect, useState } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import "../../../style/userTable.css";

function DutiesForm({ duties, setDuties }) {

  const [officeHoursCount, setOfficeHoursCount] = useState<number>(0);
  const [tutorialsCount, setTutorialsCount] = useState<number>(0);
  const [gradingAssignmentsCount, setGradingAssignmentsCount] = useState<number>(0);
  const [gradingTestsCount, setGradingTestsCount] = useState<number>(0);
  const [specialDescription, setSpecialDescription] = useState<string>("");
  const [specialHours, setSpecialHours] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [hoursSummation, setHoursSummation] = useState<number>(0);


  useEffect(() => {
    if(duties) {
      setOfficeHoursCount(duties.officeHoursCount ?? 0);
      setTutorialsCount(duties.tutorialsCount ?? 0);
      setGradingAssignmentsCount(duties.gradingAssignmentsCount ?? 0);
      setGradingTestsCount(duties.gradingTestsCount ?? 0);
      setSpecialDescription(duties.specialDescription ?? "");
      setSpecialHours(duties.specialHours ?? 0);
      setHours(duties.hours ?? 0);
      setHoursSummation(duties.hoursSummation ?? 0);
    }
  }, []);

  useEffect(() => {
    setDuties({
      officeHoursCount,
      tutorialsCount,
      gradingAssignmentsCount,
      gradingTestsCount,
      specialDescription,
      specialHours,
      hours,
      hoursSummation,
    });
  }, [
    officeHoursCount,
    tutorialsCount,
    gradingAssignmentsCount,
    gradingTestsCount,
    specialDescription,
    specialHours,
    hours,
    hoursSummation,
  ]);

  useEffect(() => {
    setHoursSummation(hours + specialHours)
  }, [hours, specialHours]);


  return (
    <Form.Group className="mb-2" controlId="formBasicEmail">
      <Form.Label>Duties</Form.Label>
      <Row>
        <Col>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Office Hours</InputGroup.Text>
            <Form.Control
              type="number"
              value={officeHoursCount}
              onChange={(e) => setOfficeHoursCount(parseInt(e.target.value))}
            />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Tutorials</InputGroup.Text>
            <Form.Control
              type="number"
              value={tutorialsCount}
              onChange={(e) => setTutorialsCount(parseInt(e.target.value))}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">
              Grading Assignments
            </InputGroup.Text>
            <Form.Control
              type="number"
              value={gradingAssignmentsCount}
              onChange={(e) =>
                setGradingAssignmentsCount(parseInt(e.target.value))
              }
            />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Grading Tests</InputGroup.Text>
            <Form.Control
              type="number"
              value={gradingTestsCount}
              onChange={(e) => setGradingTestsCount(parseInt(e.target.value))}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Special Duties</InputGroup.Text>
            <Form.Control
              type="text"
              value={specialDescription}
              onChange={(e) => setSpecialDescription(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Special Hours</InputGroup.Text>
            <Form.Control
              type="number"
              value={specialHours}
              onChange={(e) => setSpecialHours(parseInt(e.target.value))}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Hours</InputGroup.Text>
            <Form.Control
              type="number"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
            />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Hours Summation</InputGroup.Text>
            <Form.Control
              type="number"
              value={hoursSummation}
              disabled
            />
          </InputGroup>
        </Col>
      </Row>
    </Form.Group>
  );
}

export default DutiesForm;
