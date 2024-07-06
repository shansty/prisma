import { ErrorCode, HttpExeption } from "./root";

export class PermissionException extends HttpExeption {
    constructor(message:string, errorCode:ErrorCode) {
        super(message, errorCode, 403, null)
    }
}