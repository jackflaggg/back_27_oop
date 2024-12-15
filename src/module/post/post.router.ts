import {BaseRouter} from "../../models/base.route";
import {NextFunction, Request, Response} from "express";
import {AdminMiddleware} from "../../common/utils/middlewares/admin.middleware";
import {ResponseBody} from "../../models/request.response.params";
import {ValidateMiddleware} from "../../common/utils/middlewares/validate.middleware";
import {PostService} from "./post.service";
import {validateId} from "../../common/utils/validators/params.validator";
import {AuthBearerMiddleware} from "../../common/utils/middlewares/auth.bearer.middleware";
import {PostCreateDto} from "./dto/post.create.dto";
import {CommentCreateDto} from "../comment/dto/comment.create.dto";
import {PostUpdateDto} from "./dto/post.update.dto";
import {CommentsQueryRepository} from "../comment/comments.query.repository";
import {UsersQueryRepository} from "../user/users.query.repository";
import {PostsQueryRepository} from "./posts.query.repository";
import {JwtStrategy} from "../auth/strategies/jwt.strategy";
import {dropError} from "../../common/utils/errors/custom.errors";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";
import {getPostsQuery} from "../../common/utils/features/query.helper";
import {inject, injectable} from "inversify";
import {TYPES} from "../../models/types/types";
import {UserGetter} from "../../common/utils/features/user.getter";

@injectable()
export class PostRouter extends BaseRouter {
    constructor(
        @inject(TYPES.LoggerService) logger: LoggerService,
        @inject(TYPES.PostsQueryRepo) private postQueryRepository: PostsQueryRepository,
        @inject(TYPES.PostService) private postService: PostService,
        @inject(TYPES.CommentsQueryRepo) private commentQueryRepo: CommentsQueryRepository,
        @inject(TYPES.JwtStrategy) private jwtStrategy: JwtStrategy){
        super(logger);
        this.bindRoutes([
            {path: '/',                 method: 'get',    func: this.getAllPosts},
            {path: '/:id',              method: 'get',    func: this.getOnePost},
            {path: '/:postId/comments', method: 'get',    func: this.getCommentsToPost},
            {path: '/',                 method: 'post',   func: this.createPost,            middlewares: [new AdminMiddleware(new LoggerService(), this), new ValidateMiddleware(PostCreateDto)]},
            {path: '/:postId/comments', method: 'post',   func: this.createCommentByPost,   middlewares: [new AuthBearerMiddleware(new LoggerService(), new UsersQueryRepository(), new JwtStrategy(new LoggerService()), this), new ValidateMiddleware(CommentCreateDto)]},
            {path: '/:id',              method: 'put',    func: this.updatePost,            middlewares: [new AdminMiddleware(new LoggerService(), this), new ValidateMiddleware(PostUpdateDto)]},
            {path: '/:id',              method: 'delete', func: this.deletePost,            middlewares: [new AdminMiddleware(new LoggerService(), this)]}
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
            const {postId} = req.params;

            validateId(postId);

            const token = new UserGetter(this.jwtStrategy);

            const user = await token.execute(req.headers.authorization?.split(' ')?.[1]);

            const post = await this.postQueryRepository.giveOneToIdPost(postId);

            if (!post){
                this.notFound(res)
                return;
            }

            const allComments = await this.commentQueryRepo.getAllCommentsToPostId(postId, req.query, user)
            this.ok(res, allComments);
            return;
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

            const {postId} = req.params;

            validateId(postId);

            const comment = await this.postService.createComment(postId, new CommentCreateDto(req.body.content), req.userId)

            this.created(res, comment);
            return;
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