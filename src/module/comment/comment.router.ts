import {BaseRouter} from "../../models/base.route";
import {Request, Response, NextFunction} from "express";
import {AuthBearerMiddleware} from "../../common/utils/middlewares/auth.bearer.middleware";
import {ValidateMiddleware} from "../../common/utils/middlewares/validate.middleware";
import {validateId} from "../../common/utils/validators/params.validator";
import {CommentService} from "./comment.service";
import {CommentCreateDto} from "./dto/comment.create.dto";
import {CommentsQueryRepository} from "./comments.query.repository";
import {UsersQueryRepository} from "../user/users.query.repository";
import {JwtStrategy} from "../auth/strategies/jwt.strategy";
import {dropError} from "../../common/utils/errors/custom.errors";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";
import {CommentStatus} from "./dto/comment.like-status.dto";

export class CommentRouter extends BaseRouter {
    constructor(logger: LoggerService, private commentsQueryRepo: CommentsQueryRepository, private commentService: CommentService) {
        super(logger);
        this.bindRoutes([
            {path: '/:id',                      method: 'get',      func: this.getOneComment},
            {path: '/:commentId',               method: 'put',      func: this.updateComment,   middlewares: [new AuthBearerMiddleware(this.logger, new UsersQueryRepository(), new JwtStrategy(this.logger), this), new ValidateMiddleware(CommentCreateDto) ]},
            {path: '/:commentId/like-status',   method: 'put',      func: this.likeStatus,      middlewares: [new AuthBearerMiddleware(this.logger, new UsersQueryRepository(), new JwtStrategy(this.logger), this), new ValidateMiddleware(CommentStatus) ]},
            {path: '/:commentId',               method: 'delete',   func: this.deleteComment,   middlewares: [new AuthBearerMiddleware(this.logger, new UsersQueryRepository(), new JwtStrategy(this.logger), this)]}
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


            await this.commentService.updateComment(commentId, new CommentCreateDto(req.body), userId);
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
    async likeStatus(req: Request, res: Response, next: NextFunction){
        try {
            const {commentId} = req.params;

            validateId(commentId);

        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }
}