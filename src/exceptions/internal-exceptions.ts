import { ErrorCode, HttpExeption } from "./root";

export class InternalException extends HttpExeption {
    constructor(message:string, errors: any, errorCode:ErrorCode) {
        super(message, errorCode, 500, errors)
    }
}