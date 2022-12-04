import React from 'react';
import { Card } from 'react-bootstrap';
import "../../style/taInfoPage.css";

type Title = any; // Element | string
type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";

const TAInfoCard = ({ title = "", children, style = {}, maxHeight = "300px", flexDirection = "column", centerText = false }: { title?: Title, children: any, style?: Object, maxHeight?: string, flexDirection?: FlexDirection, centerText?: boolean }) => {

    if (centerText)
        style = { ...style, textAlign: "center" };

    return (
        <Card style={style} className="taInfoCard">
            {title && <Card.Title>{title}</Card.Title>}
            <Card.Body className="taInfoCardBody" style={{ maxHeight, flexDirection }}>
                {children}
            </Card.Body>
        </Card>
    );
};

export default TAInfoCard;