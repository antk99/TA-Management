import { ReactNode } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { OfficeHour } from "../../classes/OfficeHour";

interface InformationCardProps {
    name: string;
    email: string;
    form: ReactNode;
    officeHours?: Array<OfficeHour>;
    responsabilities?: Array<string>;
}

function InformationCard({ name, email, officeHours, responsabilities, form } : InformationCardProps) {

  return (
    <Card>
        <Card.Body>
            <Row>
                <div className="d-flex flex-row justify-content-between">
                    <Card.Title>{name}</Card.Title>
                    {form}
                </div>
            </Row>
            <Card.Text className="mb-2 text-muted">{email}</Card.Text>
            <Row>
                {officeHours && 
                    <Col className="mt-3">
                        <Card.Subtitle className="mb-2">Office Hours</Card.Subtitle>
                        <ul>
                            {
                                officeHours.map((officeHour, index) => (
                                    <li key={index}>
                                        <p className="mb-0">{officeHour.day} ({ officeHour.periodicity }) - {officeHour.startTime} to {officeHour.endTime}</p>
                                        <p>{officeHour.location}</p>
                                    </li>
                                ))
                            }
                        </ul>
                    </Col>
                }   
                {responsabilities && 
                    <Col>
                        <div className="mt-4">
                            <Card.Subtitle className="mb-2">Responsabilities</Card.Subtitle>
                            <ul>
                                {
                                    responsabilities.map((responsability, index) => (
                                        <li key={index}>{responsability}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    </Col>
                }   
            </Row>
        </Card.Body>
    </Card>
  );
}

export default InformationCard;
