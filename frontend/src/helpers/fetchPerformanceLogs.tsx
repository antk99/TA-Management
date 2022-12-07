export const fetchPerformanceLogByTa = async (taId: string) => {
    try {
        const res = await fetch("http://127.0.0.1:3000/api/performanceLog/ta/" + taId);
        const data = await res.json();
        return data;
    }  catch (err) {
        return err;
    }
};