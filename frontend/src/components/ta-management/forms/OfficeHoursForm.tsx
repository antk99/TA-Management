import { useEffect, useState } from "react";
import { Button, Form, Row, Col, InputGroup, Card } from "react-bootstrap";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import "../../../style/userTable.css";
import { OfficeHour, OFFICE_HOURS_DAYS, OFFICE_HOURS_HOURS } from "../../../classes/OfficeHour";

function OfficeHoursForm({ officeHours, setOfficeHours }) {

  const [tempOfficeHours, setTempOfficeHours] = useState<Array<OfficeHour>>([]);

  useEffect(() => {
    setTempOfficeHours(officeHours);
  }, []);

  useEffect(() => {
    setOfficeHours(tempOfficeHours);
}, [tempOfficeHours]);

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
    <Form.Group className="mb-2" controlId="formBasicEmail">
        <Form.Label>Office hours</Form.Label>
        {tempOfficeHours.map((officeHour, index) => (
            <Card key={index} className="mt-2">
                <Card.Body>
                <Row className="p-0 mt-2">
                    <Col>
                    <InputGroup>
                        <InputGroup.Text id="basic-addon1">Day</InputGroup.Text>
                        <Form.Select
                        onChange={(e) => updateOfficeHourField(index, "day", e.target.value)}
                        value={officeHour.day}
                        >
                        {OFFICE_HOURS_DAYS.map((day, i) => (
                            <option value={day} key={i}>{day}</option>
                        ))}
                        </Form.Select>
                    </InputGroup>
                    </Col>
                    <Col>
                    <InputGroup>
                        <InputGroup.Text id="basic-addon1">Location</InputGroup.Text>
                        <Form.Control
                        type="text"
                        placeholder="Location"
                        value={officeHour.location}
                        onChange={(e) => updateOfficeHourField(index, "location", e.target.value)}
                        />
                    </InputGroup>
                    </Col>
                </Row>
                <Row className="p-0 mt-2">
                    <Col>
                    <InputGroup className="col-xs-6">
                        <InputGroup.Text id="basic-addon1">Start time</InputGroup.Text>
                        <Form.Select
                        onChange={(e) => updateOfficeHourField(index, "startTime", e.target.value)}
                        value={officeHour.startTime}
                        >
                        {OFFICE_HOURS_HOURS.map((hour, i) => (
                            <option value={hour} key={i}>{hour}</option>
                        ))}
                        </Form.Select>
                    </InputGroup>
                    </Col>
                    <Col>
                    <InputGroup className="col-xs-6">
                        <InputGroup.Text id="basic-addon1">End time</InputGroup.Text>
                        <Form.Select
                        onChange={(e) => updateOfficeHourField(index, "endTime", e.target.value)}
                        value={officeHour.endTime}
                        >
                        {OFFICE_HOURS_HOURS.map((hour, i) => (
                            <option value={hour} key={i}>{hour}</option>
                        ))}
                        </Form.Select>

                    </InputGroup>
                    </Col>
                    <Col>
                    <InputGroup className="col-xs-6">
                        <InputGroup.Text id="basic-addon1">Periodicity</InputGroup.Text>
                        <Form.Select
                          onChange={(e) => updateOfficeHourField(index, "periodicity", e.target.value)}
                          value={officeHour.periodicity}
                        >
                        {['weekly', 'biweekly'].map((period, i) => (
                            <option value={period} key={i}>{period}</option>
                        ))}
                        </Form.Select>

                    </InputGroup>
                    </Col>
                </Row>
                <Button
                    className="mt-2"
                    variant="danger"
                    onClick={() => {
                        const newOfficeHours = [...tempOfficeHours];
                        newOfficeHours.splice(index, 1);
                        setTempOfficeHours(newOfficeHours);
                    }}
                    >
                    Remove
                </Button>
                </Card.Body>
            </Card>
        ))}
        <Button className="mt-2" variant="light" onClick={() => setTempOfficeHours([...tempOfficeHours, {
            day: "Monday",
            startTime: "10:00",
            endTime: "12:00",
            location: "Zoom",
            periodicity: "weekly",
            }])}
        >
        <AddIcon fontSize="small" /> Add office hour
        </Button>
    </Form.Group>
  );
}

export default OfficeHoursForm;
