import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {NextFunction, Request, Response} from "express";
import {AdminMiddleware} from "../../middlewares/admin.middleware";
import {getPostsQuery} from "../../utils/features/query/query.helper";
import {PostsQueryRepository} from "../../repositories/posts/posts.query.repository";
import {dropError} from "../../utils/errors/custom.errors";

export class PostRouter extends BaseRouter{
    constructor(logger: LoggerService, private postQueryRepository: PostsQueryRepository) {
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

    async getAllPosts(req: Request, res: Response, next: NextFunction){
        try {
            const querySort = getPostsQuery(req.query);
            const posts = await this.postQueryRepository.getAllPost(querySort);
            this.ok(res, posts);
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }

    }

    async getOnePost(req: Request, res: Response, next: NextFunction){
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

    getCommentsToPost(req: Request, res: Response, next: NextFunction){
        try {
            this.ok(res, 'all comments');
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }

    createPost(req: Request, res: Response, next: NextFunction){
        try {
            this.created(res, 'create user');
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }

    createCommentByPost(req: Request, res: Response, next: NextFunction){
        try {
            this.created(res, 'create user');
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }

    }

    updatePost(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }

    deletePost(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }
}