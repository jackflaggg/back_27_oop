import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {NextFunction, Request, Response} from "express";

export class BlogRouter extends BaseRouter{
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            { path: '/',            method: 'get', func: this.getAllBlogs},
            { path: '/:id',         method: 'get', func: this.getOneBlog},
            { path: '/:id/posts',   method: 'get', func: this.getAllPostsToBlog},
            { path: '/',            method: 'get', func: this.createBlog},
            { path: '/:id/posts',   method: 'get', func: this.createPostToBlog},
            { path: '/:id',         method: 'get', func: this.updateBlog},
            { path: '/:id',         method: 'get', func: this.deleteBlog},
            ])
    }
    getAllBlogs(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'all users');
    }

    getOneBlog(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'one user');
    }

    getAllPostsToBlog(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'all posts');
    }

    createBlog(req: Request, res: Response, next: NextFunction){
        this.created(res, 'create user')
    }

    createPostToBlog(req: Request, res: Response, next: NextFunction){
        this.created(res, 'create post')
    }

    updateBlog(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }

    deleteBlog(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }
}