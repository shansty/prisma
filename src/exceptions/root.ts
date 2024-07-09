// message, status code, error codes, error

export class HttpExeption extends Error {
    message: string;
    errorCode: ErrorCode;
    statusCode: number;
    errors: any;

    constructor(message:string, errorCode:ErrorCode, statusCode:number, errors:any) {
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = errors
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    NO_PERMISSIONS = 1004,
    UNAUTHORIZED = 1005,
    ADDRESS_NOT_FOUND = 1006,
    ADDRESS_DOES_NOT_BELONG_TO_USER = 1007,
    UNPROCESSABLE_ENTITY = 2001,
    INTERNAL_EXCEPTION = 3001,
    PRODUCT_NOT_FOUND = 4001,
    CART_ALREADY_EXIST = 5001,
    CART_NOT_FOUND= 5002,
    ORDER_NOT_FOUND= 6001,
}