export function IsValidValue(value) {
    return value !== undefined && value !== null && value !== "";
}

export function IsValidEmail(email) {
    return !!email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export function IsValidMobile(mobile) {
    // Regular expression to check if string is a Indian mobile number
    const regexExp = /^[6-9]\d{9}$/gi;

    return regexExp.test(mobile);
}

export function IsSameValue(value1, value2) {
    return value1 === value2;
}

export function IsValidPassword(pwd) {
    return pwd.length > 7;
}
