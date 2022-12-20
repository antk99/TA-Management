import getFullyQualifiedUrl from "./host";

export const fetchPerformanceLogByTa = async (profEmail: string, taStudentID: string, token: string) => {
    try {
        const res = await fetch(getFullyQualifiedUrl(`/api/performanceLog/${profEmail}/${taStudentID}`), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        });
        const data = await res.json();
        return data;
    } catch (err) {
        return err;
    }
};