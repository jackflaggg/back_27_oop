import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {NextFunction, Request, Response} from "express";
import {queryHelper, getBlogsQueryToPost, QueryBlogInputInterface} from "../../utils/features/query/query.helper";
import {
    RequestWithBody,
    RequestWithQuery, ResponseBody
} from "../../models/request.response.params";
import {BlogsQueryRepositories} from "../../repositories/blogs/blogs.query.repository";
import {validateId} from "../../utils/features/validate/validate.params";
import {BlogService} from "../../domain/blog/blog.service";
import {BlogCreateDto} from "../../dto/blog/blog.create.dto";
import {AdminMiddleware} from "../../middlewares/admin.middleware";
import {ValidateMiddleware} from "../../middlewares/validate.middleware";
import {PostCreateDto, PostCreateDtoLessBlogId} from "../../dto/post/post.create.dto";
import {BlogUpdateDto} from "../../dto/blog/blog.update.dto";
import {dropError} from "../../utils/errors/custom.errors";

export class BlogRouter extends BaseRouter {
    constructor( logger: LoggerService, private blogsQueryRepo: BlogsQueryRepositories, private blogService: BlogService ) {
        super(logger);
        this.bindRoutes([
            { path: '/',            method: 'get',      func: this.getAllBlogs},
            { path: '/:id',         method: 'get',      func: this.getOneBlog},
            { path: '/:id/posts',   method: 'get',      func: this.getAllPostsToBlog},
            { path: '/',            method: 'post',     func: this.createBlog, middlewares: [new AdminMiddleware(new LoggerService(), this), new ValidateMiddleware(BlogCreateDto)]},
            { path: '/:id/posts',   method: 'post',     func: this.createPostToBlog, middlewares: [new AdminMiddleware(new LoggerService(), this), new ValidateMiddleware(PostCreateDtoLessBlogId)]},
            { path: '/:id',         method: 'put',      func: this.updateBlog, middlewares: [new AdminMiddleware(new LoggerService(), this), new ValidateMiddleware(BlogUpdateDto)]},
            { path: '/:id',         method: 'delete',   func: this.deleteBlog, middlewares: [new AdminMiddleware(new LoggerService(), this)]},
            ])
    }
    async getAllBlogs(req: RequestWithQuery<QueryBlogInputInterface>, res: ResponseBody<any>, next: NextFunction){
        try {
            const querySort = queryHelper(req.query);

            const blogs = await this.blogsQueryRepo.getAllBlog(querySort);

            this.ok(res, blogs);
            return;
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async getOneBlog(req: Request, res: ResponseBody<any>, next: NextFunction){
        try {
            const {id} = req.params;

            validateId(id);

            const blog = await this.blogsQueryRepo.giveOneBlog(id);

            if (!blog) {
                this.notFound(res);
                return;
            }

            this.ok(res, blog);
            return;

        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async getAllPostsToBlog(req: Request, res: ResponseBody<any>, next: NextFunction){
        try {
            const { id } = req.params;

            validateId(id);

            const querySort = getBlogsQueryToPost(req.query);

            const existingBlog = await this.blogService.findBlogById(id);

            if (!existingBlog){
                this.notFound(res)
                return;
            }

            const allPosts = await this.blogsQueryRepo.getPostsToBlogID(existingBlog._id, querySort);

            this.ok(res, allPosts);
            return;
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }

    async createBlog(req: RequestWithBody<{ name: string, description: string, websiteUrl: string }>, res: ResponseBody<any>, next: NextFunction){
        try {
            const {name, description, websiteUrl} = req.body;

            const blog = await this.blogService.createBlog(new BlogCreateDto(name, description, websiteUrl));

            this.created(res, blog);
            return;
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }

    async createPostToBlog(req: Request, res: ResponseBody<any>, next: NextFunction){
        try {
            const {id} = req.params;

            validateId(id)

            const {title, shortDescription, content} = req.body;

            const blog = await this.blogService.findBlogById(id);

            if (!blog){
                this.notFound(res);
                return;
            }

            const newPost = await this.blogService.createPostToBlog(blog, new PostCreateDto(title, shortDescription, content, String(blog._id)));

            const searchPost = await this.blogService.findByPostId(String(newPost._id));

            if (!searchPost){
                this.notFound(res);
                return;
            }

            this.created(res, searchPost)
            return;
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }

    async updateBlog(req: Request, res: Response, next: NextFunction){
        try {
            const {id} = req.params;

            validateId(id);

            const {name, description, websiteUrl} = req.body;

            await this.blogService.updateBlog(id, {name, description, websiteUrl});

            this.noContent(res);
            return;
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }

    }

    async deleteBlog(req: Request, res: Response, next: NextFunction){
        try {
            const {id} = req.params;

            validateId(id);

            await this.blogService.deleteBlog(id);

            this.noContent(res);
            return;
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }
}