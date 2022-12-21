import React from "react";
import LabelledTextbox from "./LabelledTextbox";
import TAInfoCard from "./TAInfoCard";

type props = {
    officeHours: { day: string, startTime: string, endTime: string, location: string }[];
};

const TAInfoOfficeHoursSection = ({ officeHours }: props) => {
    const hasOfficeHours = officeHours.length > 0;

    return (
        <TAInfoCard title="TA Office Hours" style={{ width: '50%' }}>
            <div className="wishlistProfessors">
                {hasOfficeHours && officeHours.map(officeHour => (
                    <LabelledTextbox key={officeHour.day + " " + officeHour.startTime}
                        label={officeHour.day}
                        value={`${officeHour.location} from ${officeHour.startTime} to ${officeHour.endTime}`} />
                ))}

                {!hasOfficeHours && "No office hours have been set for this TA."}
            </div>
        </TAInfoCard>
    );
};

export default TAInfoOfficeHoursSection;