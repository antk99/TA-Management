import { UserTypes } from "../enums/UserTypes";
import getFullyQualifiedUrl from "./host";

export const fetchCourseData = async (token, profile = null, userId = null) => {
    try {
        let fetchUrl = "/api/course";
        if (profile && userId && profile !== UserTypes.Sysop && profile !== UserTypes.Admin) {
            fetchUrl = `/api/course/${profile === UserTypes.Professor ? 'instructor' : 'ta'}/${userId}`;
        }

        const res = await fetch(getFullyQualifiedUrl(fetchUrl), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const data = await res.json();
        const courseObject = [];
        for (const d of data.courses) {
            const instructorRes = await fetch(getFullyQualifiedUrl("/api/users/" + d.courseInstructor), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const tas = [];
            if (d.courseTAs) {
                for (const ta of d.courseTAs) {
                    const taRes = await fetch(getFullyQualifiedUrl("/api/users/" + ta.uuid), {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                    });
                    const taData = await taRes.json();
                    tas.push({ email: taData.user.email, fullName: taData.user.firstName + " " + taData.user.lastName, ...ta });
                }
            }

            let item = {
                id: d._id,
                courseNumber: d.courseNumber,
                courseName: d.courseName,
                courseDesc: d.courseDesc,
                term: d.term,
                year: d.year,
                instructorOfficeHours: d.instructorOfficeHours,
                courseTAs: tas
            }
            if (instructorRes) {
                const instructorData = await instructorRes.json();
                item["instructorName"] = instructorData.user.firstName + " " + instructorData.user.lastName;
                item["instructorEmail"] = instructorData.user.email;
            } else {
                item["instructorName"] = ""
            }
            courseObject.push(item);
        }
        return courseObject;
    } catch (err) {
        return err;
    }
};