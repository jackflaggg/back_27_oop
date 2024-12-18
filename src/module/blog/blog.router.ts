import "reflect-metadata";
import {BaseRouter} from "../../common/types/base.route";
import {NextFunction, Request, Response} from "express";
import {
    RequestWithBody,
    RequestWithQuery
} from "../../common/types/request.response.params";
import {BlogService} from "./blog.service";
import {AdminMiddleware} from "../../common/utils/middlewares/admin.middleware";
import {ValidateMiddleware} from "../../common/utils/middlewares/validate.middleware";
import {BlogCreateDto} from "./dto/blog.create.dto";
import {PostCreateDto, PostCreateDtoLessBlogId} from "../post/dto/post.create.dto";
import {BlogUpdateDto} from "./dto/blog.update.dto";
import {dropError} from "../../common/utils/errors/custom.errors";
import {getBlogsQueryToPost, QueryBlogInputInterface, queryHelper} from "../../common/utils/features/query.helper";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";
import {inject, injectable} from "inversify";
import {TYPES} from "../../common/types/types";
import {BlogsQueryRepositoriesInterface} from "./models/blog.models";
import {JwtStrategy} from "../auth/strategies/jwt.strategy";
import {AuthBearerMiddleware} from "../../common/utils/middlewares/auth.bearer.middleware";
import {UsersQueryRepository} from "../user/users.query.repository";
import {IdDTO} from "../../common/utils/validators/id.validator";

@injectable()
export class BlogRouter extends BaseRouter {
    constructor(
        @inject(TYPES.LoggerService) logger: LoggerService,
        @inject(TYPES.BlogsQueryRepo) private blogsQueryRepo: BlogsQueryRepositoriesInterface,
        @inject(TYPES.BlogService) private blogService: BlogService,
        @inject(TYPES.JwtStrategy) private jwtStrategy: JwtStrategy,
        @inject(TYPES.UserQueryRepo) private userQueryRepo: UsersQueryRepository) {
        super(logger);
        this.bindRoutes([
            {path: '/', method: 'get', func: this.getAllBlogs},
            {path: '/:id', method: 'get', func: this.getOneBlog, middlewares: [new ValidateMiddleware(IdDTO)]},
            {path: '/:id/posts', method: 'get', func: this.getAllPostsToBlog, middlewares: [new ValidateMiddleware(IdDTO)]},
            {
                path: '/',
                method: 'post',
                func: this.createBlog,
                middlewares: [new AdminMiddleware(this.logger, this), new ValidateMiddleware(BlogCreateDto)]
            },
            {
                path: '/:id/posts',
                method: 'post',
                func: this.createPostToBlog,
                middlewares: [new AdminMiddleware(this.logger, this), new ValidateMiddleware(PostCreateDtoLessBlogId), new ValidateMiddleware(IdDTO), new AuthBearerMiddleware(this.logger, this.userQueryRepo, this.jwtStrategy, this)]
            },
            {
                path: '/:id',
                method: 'put',
                func: this.updateBlog,
                middlewares: [new AdminMiddleware(this.logger, this), new ValidateMiddleware(BlogUpdateDto), new ValidateMiddleware(IdDTO)]
            },
            {
                path: '/:id',
                method: 'delete',
                func: this.deleteBlog,
                middlewares: [new AdminMiddleware(this.logger, this), new ValidateMiddleware(IdDTO)]
            },
        ])
    }

    async getAllBlogs(req: RequestWithQuery<QueryBlogInputInterface>, res: Response, next: NextFunction) {
        try {
            const querySort = queryHelper(req.query);

            const blogs = await this.blogsQueryRepo.getAllBlog(querySort);

            this.ok(res, blogs);
            return;
        } catch (err: unknown) {
            this.handleError(err, res);
        }
    }

    async getOneBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            const blog = await this.blogsQueryRepo.giveOneBlog(id);

            this.ok(res, blog);

            return;

        } catch (err: unknown) {
            this.handleError(err, res);
        }
    }

    async getAllPostsToBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            const querySort = getBlogsQueryToPost(req.query);

            const existingBlog = await this.blogsQueryRepo.giveOneBlog(id);

            const allPosts = await this.blogsQueryRepo.getAllPostToBlog(querySort, req.userId, existingBlog.id);

            this.ok(res, allPosts);
            return;
        } catch (err: unknown) {
            this.handleError(err, res);
        }
    }

    async createBlog(req: RequestWithBody<{
        name: string,
        description: string,
        websiteUrl: string
    }>, res: Response, next: NextFunction) {
        try {
            const {name, description, websiteUrl} = req.body;

            const blog = await this.blogService.createBlog(new BlogCreateDto(name, description, websiteUrl));

            this.created(res, blog);
            return;
        } catch (err: unknown) {
            this.handleError(err, res);
        }
    }

    async createPostToBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            const {title, shortDescription, content} = req.body;

            const blog = await this.blogsQueryRepo.giveOneBlog(id);

            const newPost = await this.blogService.createPostToBlog(
                blog.name,
                new PostCreateDto(title, shortDescription, content, blog.id),
                req.userId);

            this.created(res, newPost)
            return;
        } catch (err: unknown) {
            this.handleError(err, res);
        }
    }

    async updateBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            const {name, description, websiteUrl} = req.body;

            await this.blogService.updateBlog(id, {name, description, websiteUrl});

            this.noContent(res);
            return;
        } catch (err: unknown) {
            this.handleError(err, res);
        }

    }

    async deleteBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            await this.blogService.deleteBlog(id);

            this.noContent(res);
            return;
        } catch (err: unknown) {
            this.handleError(err, res);
        }
    }

    private handleError(err: unknown, res: Response) {
        dropError(err, res);
        return;
    }
}