import React, { useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { CourseTA } from "../../classes/CourseTA";
import "../../style/course.css";
import PerformanceLogForm from "./forms/PerformanceLogForm";
import { CourseContext } from "./ManageTAs";

const PerformanceLog = () => {
    const { course } = useContext(CourseContext);
    const [selectedTAUuid, setSelectedTAUUid] = useState<string>("")
    const [selectedTA, setSelectedTA] = useState<CourseTA>()

    useEffect(() => {
        if (course.courseTAs && course.courseTAs[0]) {
            setSelectedTAUUid(course.courseTAs[0].uuid)
        }
    }, [course])

    useEffect(() => {
        if (course.courseTAs) {
            const ta = course.courseTAs.find((ta: CourseTA) => ta.uuid === selectedTAUuid);
            setSelectedTA(ta);
        }
    }, [selectedTAUuid, course])

    return (
        <div className="mt-2">
            <div className="d-flex flex-column align-items-start">
                <h4>Select a TA to view their performance log</h4>
                <Form.Select
                    className="w-25 mt-3"
                    onChange={(e) => setSelectedTAUUid(e.target.value)}
                    value={selectedTAUuid}
                >
                    {course.courseTAs.map((ta, i) => (
                        <option value={ta.uuid} key={i}>{ta.fullName}</option>
                    ))}
                </Form.Select>
                <PerformanceLogForm ta={selectedTA} />
            </div>
        </div>
    );
};

export default PerformanceLog;
