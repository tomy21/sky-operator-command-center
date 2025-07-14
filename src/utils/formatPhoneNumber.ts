export const validateWhatsAppNumber = (number: string): { isValid: boolean; message?: string } => {
    const cleanedNumber = number.replace(/\D/g, '');

    if (cleanedNumber.length < 10 || cleanedNumber.length > 13) {
        return {
            isValid: false,
            message: "Nomor harus terdiri dari 10 hingga 13 digit"
        };
    }

    if (!cleanedNumber.startsWith('08') && !cleanedNumber.startsWith('02')) {
        return {
            isValid: false,
            message: "Nomor harus diawali dengan 08 atau 02 (contoh: 081234567890)"
        };
    }

    if (!/^[0-9]+$/.test(cleanedNumber)) {
        return {
            isValid: false,
            message: "Nomor hanya boleh mengandung angka"
        };
    }

    return { isValid: true };
};