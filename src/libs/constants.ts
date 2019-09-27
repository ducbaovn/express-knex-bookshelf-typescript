export const JWT_WEB_TOKEN = {
    DEFAULT_ISSUER: "template",
    DEFAULT_CLIENT: "simulator",
    DEFAULT_EXPIRE: 365 * 2 * 24 * 60 * 60 * 1000 // 2 years,
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

export const DELETE_STATUS = {
    YES: true,
    NO: false,
};

export const ENABLE_STATUS = {
    YES: true,
    NO: false,
};

export const POSTGRES_ERROR_CODE = {
    UNIQUE_CONSTRAINT: "23505",
    LOCK_TIMEOUT: "55P03",
    STATEMENT_TIMEOUT: "57014"
};
