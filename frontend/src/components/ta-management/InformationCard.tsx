import { ReactNode } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { OfficeHour } from "../../classes/OfficeHour";
import "../../style/taInfoPage.css"
import LabelledTextbox from "../admin/LabelledTextbox";

interface InformationCardProps {
    name: string;
    email: string;
    form: ReactNode;
    officeHours?: Array<OfficeHour>;
    responsabilities?: Array<string>;
    title: string;
}

function InformationCard({ name, email, officeHours, responsabilities, form, title }: InformationCardProps) {

    return (
        <Card className="taInfoCard">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Row>
                    <div className="d-flex flex-row justify-content-between">
                        <h5>{name}</h5>
                        {form}
                    </div>
                </Row>
                <LabelledTextbox label="Email" value={email} />
                <Container>
                    <Row>
                        {officeHours &&
                            <LabelledTextbox label="Office Hours" styles={{ display: 'block' }} value={
                                officeHours.length === 0 ? "No office hours set" :
                                    <ul>
                                        {
                                            officeHours.map((officeHour, index) => (
                                                <li key={index}>
                                                    <p className="mb-0">{officeHour.day} ({officeHour.periodicity}) - {officeHour.startTime} to {officeHour.endTime}</p>
                                                    <p>{officeHour.location}</p>
                                                </li>
                                            ))
                                        }
                                    </ul>
                            } />
                            // <Col className="mt-3">
                            //     <Card.Subtitle className="mb-2">Office Hours</Card.Subtitle>
                            //     <ul>
                            //         {
                            //             officeHours.map((officeHour, index) => (
                            //                 <li key={index}>
                            //                     <p className="mb-0">{officeHour.day} ({ officeHour.periodicity }) - {officeHour.startTime} to {officeHour.endTime}</p>
                            //                     <p>{officeHour.location}</p>
                            //                 </li>
                            //             ))
                            //         }
                            //     </ul>
                            // </Col>
                        }
                        {responsabilities &&
                            <LabelledTextbox label="Responsabilities" value={
                                <ul>
                                    {
                                        responsabilities.map((responsability, index) => (
                                            <li key={index}>{responsability}</li>
                                        ))
                                    }
                                </ul>
                            } />
                        }
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}

export default InformationCard;
