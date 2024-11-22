import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {NextFunction, Request, Response} from "express";
import {getBlogsQuery, QueryBlogInputInterface} from "../../utils/features/query/get.blogs.query";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../../models/request.response.params";
import {BlogsQueryRepositories} from "../../repositories/blogs/blogs.query.repository";
import {validateId} from "../../utils/features/validate/validate.params";
import {BlogIdParam} from "../../models/blog/blog.models";
import {BlogService} from "../../domain/blog/blog.service";
import {BlogCreateDto} from "../../dto/blog/blog.create.dto";
import {AdminMiddleware} from "../../middlewares/admin.middleware";

export class BlogRouter extends BaseRouter {
    constructor( logger: LoggerService, private blogsQueryRepo: BlogsQueryRepositories, private blogService: BlogService ) {
        super(logger);
        this.bindRoutes([
            { path: '/',            method: 'get',      func: this.getAllBlogs},
            { path: '/:id',         method: 'get',      func: this.getOneBlog},
            { path: '/:id/posts',   method: 'get',      func: this.getAllPostsToBlog},
            { path: '/',            method: 'post',     func: this.createBlog, middlewares: [new AdminMiddleware(new LoggerService(), this)]},
            { path: '/:id/posts',   method: 'post',     func: this.createPostToBlog},
            { path: '/:id',         method: 'put',      func: this.updateBlog, middlewares: [new AdminMiddleware(new LoggerService(), this)]},
            { path: '/:id',         method: 'delete',   func: this.deleteBlog, middlewares: [new AdminMiddleware(new LoggerService(), this)]},
            ])
    }
    async getAllBlogs(req: RequestWithQuery<QueryBlogInputInterface>, res: Response, next: NextFunction){
            const querySort = getBlogsQuery(req.query);
            const blogs = await this.blogsQueryRepo.getAllBlog(querySort);
            this.ok(res, blogs);
    }

    async getOneBlog(req: Request, res: Response, next: NextFunction){
            const { id } = req.params;

            if (!id || validateId(id)){
                this.badRequest(res, {message: 'невалидный айди', field: 'id'})
            }

            const blog = await this.blogsQueryRepo.giveOneBlog(id);
            if (!blog){
                this.notFound(res)
            }

            this.ok(res, blog);
    }

    async getAllPostsToBlog(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'all posts');
    }

    async createBlog(req: RequestWithBody<{ name: string, description: string, websiteUrl: string }>, res: Response, next: NextFunction){
        const {name, description, websiteUrl} = req.body;
        if (!name || !description || !websiteUrl){
            this.badRequest(res, {message: 'не передано одно из входных значений', field: 'req.body'});
        }
        const blog = await this.blogService.createBlog(new BlogCreateDto(name, description, websiteUrl));
        this.created(res, blog.data)
    }

    async createPostToBlog(req: Request, res: Response, next: NextFunction){
        this.created(res, 'create post')
    }

    async updateBlog(req: Request, res: Response, next: NextFunction){
        const {id} = req.params;
        if (!id || validateId(id)){
            this.badRequest(res, {message: 'невалидный id', field: 'req.body'});
            return;
        }

        const {name, description, websiteUrl} = req.body;
        if (!name || !description || !websiteUrl){
            this.badRequest(res, {message: 'не передано одно из входных значений', field: 'req.body'});
        }

        const updateDate = await this.blogService.updateBlog(id, {name, description, websiteUrl});
        if (updateDate.extensions){
            this.notFound(res)
        }
        this.noContent(res);
    }

    async deleteBlog(req: Request, res: Response, next: NextFunction){
        const {id} = req.params;
        if (!id || validateId(id)){
            this.badRequest(res, {message: 'невалидный id', field: 'req.body'});
            return;
        }
        await this.blogService.deleteBlog(id);
        this.noContent(res);
    }
}