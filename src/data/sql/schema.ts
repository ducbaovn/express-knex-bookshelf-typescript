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

export const ORDERS_TABLE_SCHEMA = {
    TABLE_NAME: "orders",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        IS_ENABLE: "is_enable",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        USER_ID: "user_id",
        NOTES: "notes",
        TOTAL_AMOUNT: "total_amount",
        ESTIMATED_MINUTES: "estimated_minutes"
    }
};

export const DISHES_TABLE_SCHEMA = {
    TABLE_NAME: "dishes",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        IS_ENABLE: "is_enable",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        DESCRIPTION: "description",
        IMAGES: "images",
        PRICE: "price",
        COOKING_MINUTES: "cooking_minutes"
    }
};

export const ORDER_DISH_TABLE_SCHEMA = {
    TABLE_NAME: "order_dish",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        IS_ENABLE: "is_enable",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        ORDER_ID: "order_id",
        DISH_ID: "dish_id",
        QUANTITY: "quantity",
        TOTAL_AMOUNT: "total_amount",
        STATUS: "status",
        SERVED_BY: "served_by"
    }
};