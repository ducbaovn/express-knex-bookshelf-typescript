export const USERS_TABLE_SCHEMA = {
    TABLE_NAME: "users",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        IS_ENABLE: "is_enable",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        USER_NAME: "user_name",
        PASSWORD: "password",
        ROLE_ID: "role_id"
    }
};

export const ROLES_TABLE_SCHEMA = {
    TABLE_NAME: "roles",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        IS_ENABLE: "is_enable",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        DESCRIPTION: "description"
    }
};

export const SESSIONS_TABLE_SCHEMA = {
    TABLE_NAME: "sessions",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        IS_ENABLE: "is_enable",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        USER_ID: "user_id",
        ROLE_ID: "role_id"
    }
};