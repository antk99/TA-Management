import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import convertScoreToStars from "../../helpers/convertScoreToStars";

type props = {
    name: string;
    legalName: string;
    averageScore: number;
};

const TAInfoTitleSection = ({ name, legalName, averageScore }: props) => {

    return (
        <div className="rowC">
            <h2>
                {name}&nbsp;
                {"("}
                <OverlayTrigger placement='top' overlay={<Tooltip>Legal Name</Tooltip>}>
                    <span style={{ textDecoration: "none", borderBottom: "1px dotted black" }}>{legalName && name !== legalName && `${legalName}`}</span>
                </OverlayTrigger>
                {")"}&nbsp;
                <OverlayTrigger placement='top' overlay={<Tooltip>Student Rating Average {`(${averageScore})`}</Tooltip>}>
                    <span>{convertScoreToStars(averageScore)}</span>
                </OverlayTrigger>
            </h2>
        </div>
    );
};

export default TAInfoTitleSection;