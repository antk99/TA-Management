export const fetchPerformanceLogByTa = async (profEmail: string, taId: string, token: string) => {
    try {
        const res = await fetch(`http://127.0.0.1:3000/api/performanceLog/${profEmail}/${taId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        });
        const data = await res.json();
        return data;
    }  catch (err) {
        return err;
    }
};