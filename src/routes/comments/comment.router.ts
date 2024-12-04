import {BaseRouter} from "../base.route";
import {LoggerService} from "../../utils/logger/logger.service";
import {Request, Response, NextFunction} from "express";
import {AuthBearerMiddleware} from "../../middlewares/auth.bearer.middleware";
import {UsersQueryRepository} from "../../repositories/users/users.query.repository";
import {JwtService} from "../../utils/jwt/jwt.service";
import {ValidateMiddleware} from "../../middlewares/validate.middleware";
import {CommentCreateDto} from "../../dto/comment/comment.create.dto";
import {validateId} from "../../utils/features/validate/validate.params";
import {CommentsQueryRepository} from "../../repositories/comments/comments.query.repository";
import {CommentService} from "../../domain/comment/comment.service";
import {dropError} from "../../utils/errors/custom.errors";

export class CommentRouter extends BaseRouter {
    constructor(logger: LoggerService, private commentsQueryRepo: CommentsQueryRepository, private commentService: CommentService) {
        super(logger);
        this.bindRoutes([
            {path: '/:id',        method: 'get', func: this.getOneComment},
            {path: '/:commentId', method: 'put', func: this.updateComment, middlewares: [new AuthBearerMiddleware(this.logger, new UsersQueryRepository(), new JwtService(this.logger), this), new ValidateMiddleware(CommentCreateDto) ]},
            {path: '/:commentId', method: 'delete', func: this.deleteComment, middlewares: [new AuthBearerMiddleware(this.logger, new UsersQueryRepository(), new JwtService(this.logger), this)]}
        ])
    }
    async getOneComment(req: Request, res: Response, next: NextFunction){
        try {
            const {id} = req.params;

            validateId(id);

            const comment = await this.commentsQueryRepo.getComment(id);
            if (!comment) {
                this.notFound(res);
                return;
            }
            this.ok(res, 'get comment');
            return;
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }
    async updateComment(req: Request, res: Response, next: NextFunction){
        try {
            const {commentId} = req.params;

            const {userId} = req;

            const {content} = req.body;

            this.noContent(res);
            return;
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }
    async deleteComment(req: Request, res: Response, next: NextFunction){
        try {
            const {commentId} = req.params;

            validateId(commentId);

            await this.commentService.deleteComment(commentId, req.userId);
            this.noContent(res);
            return;
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }
}