import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {NextFunction, Request, Response} from "express";
import {AdminMiddleware} from "../../middlewares/admin.middleware";
import {getPostsQuery} from "../../utils/features/query/get.blogs.query";
import {PostsQueryRepository} from "../../repositories/posts/posts.query.repository";

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
        const querySort = getPostsQuery(req.query);
        const posts = await this.postQueryRepository.getAllPost(querySort);
        this.ok(res, posts);
    }

    async getOnePost(req: Request, res: Response, next: NextFunction){
        const {id} = req.body;
        const post = await this.postQueryRepository.giveOneToIdPost(id);
        if (!post){
            this.notFound(res);
        }
        this.ok(res, post);
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