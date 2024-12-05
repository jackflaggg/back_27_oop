import {BaseRouter} from "../../models/base.route";
import {NextFunction, Request, Response} from "express";
import {TestingDbRepositories} from "./testing.db.repository";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";

export class TestingRouter extends BaseRouter {
    testingRepositories: TestingDbRepositories
    constructor(logger: LoggerService, testingRepositories: TestingDbRepositories){
        super(logger);
        this.testingRepositories = testingRepositories;
        this.bindRoutes([
            {path: '/all-data', method: 'delete', func: this.deleteAll }
        ])
    }
    async deleteAll(req: Request, res: Response, next: NextFunction){
        await this.testingRepositories.delete()
        this.noContent(res);
    }
}