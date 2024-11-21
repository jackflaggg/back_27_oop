import {BaseRouter} from "../base.route";
import {LoggerService} from "../../utils/logger/logger.service";
import {Request, Response, NextFunction} from "express";

export class CommentRouter extends BaseRouter {
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            {path: '/:id',        method: 'get', func: this.getOneComment},
            {path: '/:commentId', method: 'put', func: this.updateComment},
            {path: '/:commentId', method: 'delete', func: this.deleteComment}
        ])
    }
    getOneComment(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'get comment');
    }
    updateComment(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }
    deleteComment(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }
}