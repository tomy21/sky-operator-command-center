export const fetchCall = async (date: string) => {
    try {
        const response = await fetch(`/api/summary/count-call?date=${date}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal get data total call');
        }

        return await response.json();
    } catch (error) {
        console.error('Error get call data');
        throw error;
    }
};