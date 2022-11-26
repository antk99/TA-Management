export const fetchCourseData = async () => {
    try {
        const res = await fetch("http://127.0.0.1:3000/api/course");
        const data = await res.json();
        const courseObject = [];
        for (const d of data.courses) {
            const instructorRes = await fetch("http://127.0.0.1:3000/api/users/" + d.courseInstructor);
            let item = {
                courseNumber: d.courseNumber,
                courseName: d.courseName,
                courseDesc: d.courseDesc,
                term: d.term,
                year: d.year,
            }
            if (instructorRes) {
                const instructorData = await instructorRes.json();
                item["instructorName"] = instructorData.user.firstName + " " + instructorData.user.lastName;
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