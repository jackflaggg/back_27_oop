import {BaseRouter} from "../../models/base.route";
import {NextFunction, Request, Response} from "express";
import {TestingDbRepositories} from "./testing.db.repository";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";
import {testingRouterInterface} from "../../models/testing/testing.models";
import {dropError} from "../../common/utils/errors/custom.errors";
import {inject, injectable} from "inversify";
import {TYPES} from "../../models/types/types";

@injectable()
export class TestingRouter extends BaseRouter implements testingRouterInterface {
    #testingRepositories: TestingDbRepositories
    constructor(
        @inject(TYPES.LoggerService) logger: LoggerService,
        @inject(TYPES.TestingDbRepo) testingRepositories: TestingDbRepositories){
        super(logger);
        this.#testingRepositories = testingRepositories;
        this.bindRoutes([
            {path: '/all-data', method: 'delete', func: this.deleteAll }
        ])
    }
    async deleteAll(req: Request, res: Response, next: NextFunction){
        try {
            await this.#testingRepositories.delete();
            this.noContent(res);
            return;
        } catch (err: unknown) {
            dropError(err, res)
            return;
        }
    }
}