import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";

export class SessionRouter extends BaseRouter{
    constructor(logger: LoggerService) {
        super(logger)
    }
}