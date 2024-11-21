import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";

export class AuthRouter extends BaseRouter{
    constructor(logger: LoggerService) {
        super(logger)
    }
}