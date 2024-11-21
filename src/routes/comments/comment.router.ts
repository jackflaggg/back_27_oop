import {BaseRouter} from "../base.route";
import {LoggerService} from "../../utils/logger/logger.service";

export class CommentRouter extends BaseRouter {
    constructor(logger: LoggerService) {
        super(logger);
    }
}