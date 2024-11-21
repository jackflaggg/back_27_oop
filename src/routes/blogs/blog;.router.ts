import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";

export class BlogRouter extends BaseRouter{
    constructor(logger: LoggerService) {
        super(logger)
    }
}