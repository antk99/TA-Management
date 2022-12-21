import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import convertScoreToStars from "../../helpers/convertScoreToStars";

type props = {
    name: string;
    legalName: string;
    averageScore: number;
};

const TAInfoTitleSection = ({ name, legalName, averageScore }: props) => {
    const showLegalName = legalName && name !== legalName;
    const legalNameElement = (
        <OverlayTrigger placement='top' overlay={<Tooltip>Legal Name</Tooltip>}>
            <span>{legalName}</span>
        </OverlayTrigger>
    );

    return (
        <div className="rowC">
            <h2>
                {name}
                {showLegalName && " ("}
                {showLegalName && legalNameElement}
                {showLegalName && ") "}
                <OverlayTrigger placement='top' overlay={<Tooltip>Student Rating Average {`(${averageScore})`}</Tooltip>}>
                    <span>{convertScoreToStars(averageScore)}</span>
                </OverlayTrigger>
            </h2>
        </div>
    );
};

export default TAInfoTitleSection;