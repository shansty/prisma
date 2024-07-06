import { ErrorCode, HttpExeption } from "./root";

export class UnprocessableEntity extends HttpExeption {
    constructor(errors: any, message: string, errorCode: ErrorCode) {
        super(message, errorCode, 422, errors)
    }
}