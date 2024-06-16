function validateEmail(email) {
    const regexPattern = /^(.+)@(.+)?iith\.ac\.in$/;

    const match = email.match(regexPattern);

    if (match) {
        const capturedPart = match[2];
        console.log(`Captured part: ${capturedPart}`);
        return {status: 'ok', data: {capturedPart: capturedPart}};
    } else {
        return {status: 'error', data: {message: 'Invalid email'}};
    }
}

// Test cases
const emails = [
    "ep23btech11016@iith.ac.in",
    "cult_secy@gynkhana.iith.ac.in",
    "fsdfsdf@fghdf.iith.ac.in",
    "wrong@format.iith.in",
];

module.exports = validateEmail;
