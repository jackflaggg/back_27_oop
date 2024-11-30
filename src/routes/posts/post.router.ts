import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {NextFunction, Request, Response} from "express";
import {AdminMiddleware} from "../../middlewares/admin.middleware";
import {getPostsQuery} from "../../utils/features/query/query.helper";
import {PostsQueryRepository} from "../../repositories/posts/posts.query.repository";
import {dropError} from "../../utils/errors/custom.errors";
import {ResponseBody} from "../../models/request.response.params";
import {ValidateMiddleware} from "../../middlewares/validate.middleware";
import {PostCreateDto} from "../../dto/post/post.create.dto";
import {PostService} from "../../domain/post/post.service";
import {PostUpdateDto} from "../../dto/post/post.update.dto";
import {validateId} from "../../utils/features/validate/validate.params";
import {CommentCreateDto} from "../../dto/comment/comment.create.dto";
import {AuthBearerMiddleware} from "../../middlewares/auth.bearer.middleware";
import {UsersQueryRepository} from "../../repositories/users/users.query.repository";
import {JwtService} from "../../utils/jwt/jwt.service";

export class PostRouter extends BaseRouter{
    constructor(logger: LoggerService, private postQueryRepository: PostsQueryRepository, private postService: PostService) {
        super(logger);
        this.bindRoutes([
            {path: '/',                 method: 'get',    func: this.getAllPosts},
            {path: '/:id',              method: 'get',    func: this.getOnePost},
            {path: '/:postId/comments', method: 'get',    func: this.getCommentsToPost},
            {path: '/',                 method: 'post',   func: this.createPost, middlewares: [new AdminMiddleware(new LoggerService(), this), new ValidateMiddleware(PostCreateDto)]},
            {path: '/:postId/comments', method: 'post',   func: this.createCommentByPost, middlewares: [new AuthBearerMiddleware(new LoggerService(), new UsersQueryRepository(), new JwtService(new LoggerService()), this), new ValidateMiddleware(CommentCreateDto)]},
            {path: '/:id',              method: 'put',    func: this.updatePost, middlewares: [new AdminMiddleware(new LoggerService(), this), new ValidateMiddleware(PostUpdateDto)]},
            {path: '/:id',              method: 'delete', func: this.deletePost, middlewares: [new AdminMiddleware(new LoggerService(), this)]}
        ])
    }

    async getAllPosts(req: Request, res: ResponseBody<any>, next: NextFunction){
        try {
            const querySort = getPostsQuery(req.query);
            const posts = await this.postQueryRepository.getAllPost(querySort);
            this.ok(res, posts);
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }

    }

    async getOnePost(req: Request, res: ResponseBody<any>, next: NextFunction){
        try {
            const {id} = req.body;

            const post = await this.postQueryRepository.giveOneToIdPost(id);

            if (!post){
                this.notFound(res);
            }
            this.ok(res, post);
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }

    async getCommentsToPost(req: Request, res: ResponseBody<any>, next: NextFunction){
        try {
            this.ok(res, 'all comments');
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }

    async createPost(req: Request, res: Response, next: NextFunction){
        try {
            const {title, shortDescription, content, blogId} = req.body;
            const post = await this.postService.createPost(new PostCreateDto(title, shortDescription, content, blogId));
            this.created(res, post);
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }

    async createCommentByPost(req: Request, res: Response, next: NextFunction){
        try {
            const {id} = req.params;

            validateId(id);
            const {content} = req.body;
            const comment = await this.postService.createComment(content)
            this.created(res, 'create user');
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }

    }

    async updatePost(req: Request, res: Response, next: NextFunction){
        try {
            const {id} = req.params;

            validateId(id)

            const {title, shortDescription, content, blogId} = req.body;

            await this.postService.updatePost(new PostUpdateDto(title, shortDescription, content, blogId));
            this.noContent(res);
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }

    async deletePost(req: Request, res: Response, next: NextFunction){
        try {
            const {id} = req.params;

            validateId(id)

            await this.postService.deletePost(id);

            this.noContent(res);
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }
}