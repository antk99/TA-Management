export const fetchCourseData = async () => {
    try {
        const res = await fetch("http://127.0.0.1:3000/api/course");
        const data = await res.json();
        const courseObject = [];
        for (const d of data.courses) {
            const instructorRes = await fetch("http://127.0.0.1:3000/api/users/" + d.courseInstructor);

            const tas = [];
            if(d.courseTAs) {
                for (const ta of d.courseTAs) {
                    const taRes = await fetch("http://127.0.0.1:3000/api/users/" + ta.uuid);
                    const taData = await taRes.json();
                    tas.push({email: taData.user.email, fullName: taData.user.firstName + " " + taData.user.lastName, ...ta });
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