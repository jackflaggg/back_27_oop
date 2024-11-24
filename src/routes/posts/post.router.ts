import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {NextFunction, Request, Response} from "express";
import {AdminMiddleware} from "../../middlewares/admin.middleware";

export class PostRouter extends BaseRouter{
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            {path: '/',                 method: 'get',    func: this.getAllPosts},
            {path: '/:id',              method: 'get',    func: this.getOnePost},
            {path: '/:postId/comments', method: 'get',    func: this.getCommentsToPost},
            {path: '/',                 method: 'post',   func: this.createPost, middlewares: [new AdminMiddleware(new LoggerService(), this)]},
            {path: '/:postId/comments', method: 'post',   func: this.createCommentByPost},
            {path: '/:id',              method: 'put',    func: this.updatePost, middlewares: [new AdminMiddleware(new LoggerService(), this)]},
            {path: '/:id',              method: 'delete', func: this.deletePost, middlewares: [new AdminMiddleware(new LoggerService(), this)]}
        ])
    }

    getAllPosts(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'all posts');
    }

    getOnePost(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'one post');
    }

    getCommentsToPost(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'all comments');
    }

    createPost(req: Request, res: Response, next: NextFunction){
        this.created(res, 'create user');
    }

    createCommentByPost(req: Request, res: Response, next: NextFunction){
        this.created(res, 'create user');
    }

    updatePost(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }

    deletePost(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }
}