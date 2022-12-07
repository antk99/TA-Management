import React, { useContext, useEffect, useState } from "react";
import "../../style/course.css";
import { Card } from "react-bootstrap";
import { CourseContext } from "./ManageTAs";
import { CourseTA } from "../../classes/CourseTA";
import SelectTARow from "./SelectTARow";
import InformationCard from "./InformationCard";
import { ProfileContext } from "../../pages/Dashboard";
import { UserTypes } from "../../enums/UserTypes";
import { UserContext } from "../../App";
import EditProfInformationForm from "./forms/EditProfInformationForm";
import EditTAInformationForm from "./forms/EditTAInformationForm";

const ManageOfficeHours = () => {
    const { profile } = useContext(ProfileContext)
    const { user } = useContext(UserContext)
    const { course } = useContext(CourseContext);

    const [currentTA, setCurrentTA] = useState<CourseTA>(null);

    const findTAInCourse = (userId) => {
        return course.courseTAs.find((courseTA: CourseTA) => courseTA.uuid === userId);
    }

    useEffect(() => {
        if (course.courseTAs && user) {
            const ta = findTAInCourse(user.id);
            console.log(user, ta, course.courseTAs)
            if (ta) {
                setCurrentTA(ta);
            }
        }
    }, [course, user])
    
    return (
        <div className="mt-4">
            {profile && profile === UserTypes.Professor &&
                <InformationCard
                    form={<EditProfInformationForm instructor={{ instructorName: course.instructorName, email: course.instructorEmail, officeHours: course.instructorOfficeHours }}/>}
                    name={course.instructorName}
                    email={course.instructorEmail}
                    officeHours={course.instructorOfficeHours}
                />
            }

            {currentTA && profile === UserTypes.TA &&
                <InformationCard
                    form={<EditTAInformationForm ta={currentTA}/>}
                    name={currentTA.fullName}
                    email={currentTA.email}
                    officeHours={currentTA.officeHours}
                    responsabilities={currentTA.responsabilities}
                />
            }

            {profile && profile === UserTypes.Professor && course.courseTAs &&
                <Card className="mt-5">
                    <Card.Body>
                        <Card.Title>TAs</Card.Title>

                        <table className="w-100">
                            <thead>
                            <tr>
                                <th className="column1">Name</th>
                                <th className="column2">Email</th>
                                <th className="column3">Responsabilities</th>
                                <th className="column4">Office Hours</th>
                            </tr>
                            </thead>
                            <tbody>
                            {course.courseTAs.map((ta: CourseTA, i: number) => (
                                <SelectTARow ta={ta} key={i}/>
                            ))}
                            </tbody>
                        </table>
                    </Card.Body>    
                </Card>
            }
        </div>
    );
};

export default ManageOfficeHours;
