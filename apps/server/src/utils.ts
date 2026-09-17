function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password: string) {
    const passwordRegex = /^(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

function validatePhoneNumber(phone: string) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(phone);
}

export function validateUserData(email: string, password: string, phone: string) {
    if (!validateEmail(email)) {
        throw new Error('Invalid email format');
    }
    if (!validatePassword(password)) {
        throw new Error('Password must be at least 8 characters long and include a number');
    }
    if (!validatePhoneNumber(phone)) {
        throw new Error('Invalid phone number format');
    }
}

