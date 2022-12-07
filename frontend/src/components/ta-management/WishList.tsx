import { AddBoxRounded } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { CourseTA } from "../../classes/CourseTA";
import "../../style/course.css";
import PerformanceLogForm from "./forms/PerformanceLogForm";
import { CourseContext } from "./ManageTAs";

const WishList = () => {
    const { course } = useContext(CourseContext);

    const addToWishList = (ta: CourseTA) => {
        console.log(ta);
    }

    return (
        <div className="mt-2">
            <div className="d-flex flex-column align-items-start">
                <Card className="taInfoCard w-100">
                    <Card.Body>
                        {course.courseTAs.map((ta, i) => (
                            <div key={i} className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h4>{ta.fullName}</h4>
                                    <p className="m-0">{ta.email}</p>
                                </div>
                                <Button onClick={() => addToWishList(ta)} variant="primary" className="d-flex align-items-center">
                                    <AddBoxRounded />
                                    <span className="ps-2">Add to wish-list</span>
                                </Button>
                            </div>
                        ))}
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default WishList;
