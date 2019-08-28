class Code {
    CODE;
    MESSAGE;

    constructor(code, message) {
        this.CODE = code;
        this.MESSAGE = message;
    }
}

export const ErrorCode = {
    SYSTEM: {
        TYPE: "System.",
        GENERIC: new Code(0, "Internal Server Error."),
        SYSTEM_TIMEOUT: new Code(1, "system timeout")
    },
    RESOURCE: {
        TYPE: "Resource.",
        GENERIC: new Code(1000, "unknown Resource's Error."),
        INVALID_URL: new Code(1001, "invalid url."),
        NOT_FOUND: new Code(1002, "resource not found"),
        DUPLICATE_RESOURCE: new Code(1003, "duplicate resource"),
        MISSING_REQUIRED_FIELDS: new Code(1004, "missing required fields"),
        CANNOT_DELETE_YOURSELF: new Code(1005, "cannot delete yourself")
    },
    AUTHENTICATION: {
        TYPE: "Authentication.",
        GENERIC: new Code(1100, "unknown authentication's error."),
        AUTHENTICATION_FAIL: new Code(1101, "authentication fails"),
        INVALID_AUTHORIZATION_HEADER: new Code(1103, "invalid authorization header."),
        TOKEN_EXPIRED: new Code(1102, "token expired"),
        USER_EXIST: new Code(1103, "user name exists")
    },
    PRIVILEGE: {
        TYPE: "Privilege",
        GENERIC: new Code(1200, "unknown privilege's error."),
        NOT_ALLOW: new Code(1201, "you do not have permission to access.")
    }
};
export default ErrorCode;
