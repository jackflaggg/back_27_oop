import {BaseRouter} from "../base.route";
import {LoggerService} from "../../utils/logger/logger.service";
import {NextFunction, Request, Response} from "express";
import {TestingDbRepositories} from "../../repositories/testing/testing.db.repository";

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