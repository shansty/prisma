import { ErrorCode, HttpExeption } from "./root";

export class BadRequestsException extends HttpExeption {
    constructor(message:string, errorCode:ErrorCode, errors: any) {
        super(message, errorCode, 400, errors)
    }
}