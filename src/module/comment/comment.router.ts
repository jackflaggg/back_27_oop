import {BaseRouter} from "../../models/base.route";
import {Request, Response, NextFunction} from "express";
import {AuthBearerMiddleware} from "../../common/utils/middlewares/auth.bearer.middleware";
import {ValidateMiddleware} from "../../common/utils/middlewares/validate.middleware";
import {validateId} from "../../common/utils/validators/params.validator";
import {CommentCreateDto} from "./dto/comment.create.dto";
import {UsersQueryRepository} from "../user/users.query.repository";
import {JwtStrategy} from "../auth/strategies/jwt.strategy";
import {dropError} from "../../common/utils/errors/custom.errors";
import {CommentStatus} from "./dto/comment.like-status.dto";
import {inject, injectable} from "inversify";
import {TYPES} from "../../models/types/types";
import {LoggerServiceInterface} from "../../models/common";
import {
    commentRouterInterface,
    commentServiceInterface,
    commentsQueryRepoInterface
} from "../../models/comment/comment.models";

@injectable()
export class CommentRouter extends BaseRouter implements commentRouterInterface {
    constructor(
        @inject(TYPES.LoggerService)        logger: LoggerServiceInterface,
        @inject(TYPES.CommentsQueryRepo)    private commentsQueryRepo: commentsQueryRepoInterface,
        @inject(TYPES.CommentService)       private commentService: commentServiceInterface) {
        super(logger);
        this.bindRoutes([
            {path: '/:commentId',               method: 'get',      func: this.getOneComment},
            {path: '/:commentId',               method: 'put',      func: this.updateComment,   middlewares: [new AuthBearerMiddleware(this.logger, new UsersQueryRepository(), new JwtStrategy(this.logger), this), new ValidateMiddleware(CommentCreateDto) ]},
            {path: '/:commentId/like-status',   method: 'put',      func: this.likeStatus,      middlewares: [new AuthBearerMiddleware(this.logger, new UsersQueryRepository(), new JwtStrategy(this.logger), this), new ValidateMiddleware(CommentStatus) ]},
            {path: '/:commentId',               method: 'delete',   func: this.deleteComment,   middlewares: [new AuthBearerMiddleware(this.logger, new UsersQueryRepository(), new JwtStrategy(this.logger), this)]}
        ])
    }
    async getOneComment(req: Request, res: Response, next: NextFunction){
        try {
            const {commentId: id} = req.params;

            validateId(id);

            const comment = await this.commentsQueryRepo.getComment(id);
            if (!comment) {
                this.notFound(res);
                return;
            }
            this.ok(res, comment);
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