import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {NextFunction, Request, Response} from "express";
import {getBlogsQuery, QueryBlogInputInterface} from "../../utils/features/query/get.blogs.query";
import {RequestWithQuery} from "../../models/request.response.params";

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
    getAllBlogs(req: RequestWithQuery<QueryBlogInputInterface>, res: Response, next: NextFunction){
        const querySort = getBlogsQuery(req.query);
        const blogs = await this.
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