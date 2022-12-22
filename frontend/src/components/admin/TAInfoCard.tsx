import React from 'react';
import { Card } from 'react-bootstrap';
import "../../style/taInfoPage.css";

type Title = any; // Element | string
type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";

const TAInfoCard = ({ title = "", children, style = {}, maxHeight = "300px", flexDirection = "column", centerText = false, bodyStyle = {} }: { title?: Title, children: any, style?: Object, maxHeight?: string, flexDirection?: FlexDirection, centerText?: boolean, bodyStyle?: Object }) => {

    if (centerText)
        style = { ...style, textAlign: "center" };

    bodyStyle = { ...bodyStyle, maxHeight, flexDirection };

    return (
        <Card style={style} className="taInfoCard">
            {title && <Card.Title>{title}</Card.Title>}
            <Card.Body className="taInfoCardBody" style={bodyStyle}>
                {children}
            </Card.Body>
        </Card>
    );
};

export default TAInfoCard;