export const JWT_WEB_TOKEN = {
    DEFAULT_ISSUER: "iCondo",
    DEFAULT_CLIENT: "simulator",
    DEFAULT_EXPIRE: 365 * 2 * 24 * 60 * 60 * 1000, // 2 years,
    RESET_PASSWORD_TIME_EXPIRED: 60 * 60 * 1000, // 60 minutes
    PIN_TIME_EXPIRED: 5 * 60 * 1000, // 60 minutes
};

export const HEADERS = {
    AUTHORIZATION: "authorization",
    USER_AGENT: "user-agent",
    DEVICE_ID: "device-id",
    REGISTRAR_ID: "registrar-id",
    DEVICE_OS: "device-os",
    DEVICE_NAME: "device-name",
    DEVICE_MODEL: "device-model",
    OS_VERSION: "os-version",
    APP_VERSION: "app-version",
    BUILD_VERSION: "build-version",
    PASSWORD: "password",
    API_KEY: "api-key",
    TOTAL: "total",
    OFFSET: "offset",
    LIMIT: "limit"
};

export const PLATFORM = {
    IOS: "iOS",
    ANDROID: "Android",
    WEB_PORTAL: "web-portal",
    WEB_RESIDENT: "web-resident"
};

export const DELETE_STATUS = {
    YES: true,
    NO: false,
};

export const ENABLE_STATUS = {
    YES: true,
    NO: false,
};

export const PASSWORD_LENGTH = 6;

export const ROLE = {
    ADMIN: "admin",
    CHEF: "chef",
    USER: "user"
};

export const POSTGRES_ERROR_CODE = {
    UNIQUE_CONSTRAINT: "23505",
    LOCK_TIMEOUT: "55P03",
    STATEMENT_TIMEOUT: "57014"
};
