import {BaseRouter} from "../../models/base.route";
import {NextFunction, Request, Response} from "express";
import {
    RequestWithBody,
    RequestWithQuery, ResponseBody
} from "../../models/request.response.params";
import {validateId} from "../../common/utils/validators/params.validator";
import {BlogService} from "./blog.service";
import {AdminMiddleware} from "../../common/utils/middlewares/admin.middleware";
import {ValidateMiddleware} from "../../common/utils/middlewares/validate.middleware";
import {BlogCreateDto} from "./dto/blog.create.dto";
import {PostCreateDto, PostCreateDtoLessBlogId} from "../post/dto/post.create.dto";
import {BlogUpdateDto} from "./dto/blog.update.dto";
import {BlogsQueryRepositories} from "./blogs.query.repository";
import {dropError} from "../../common/utils/errors/custom.errors";
import {getBlogsQueryToPost, QueryBlogInputInterface, queryHelper} from "../../common/utils/features/query.helper";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";

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