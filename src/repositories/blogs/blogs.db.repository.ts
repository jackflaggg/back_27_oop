import {Blog} from "../../dto/blog/blog.entity";
import {BlogModelClass} from "../../db/db";
import {LoggerService} from "../../utils/logger/logger.service";

export class BlogsDbRepository {
    constructor(private readonly logger: LoggerService) {
    }
    async createBlog(entity: Blog){
        try {
            return await BlogModelClass.create(entity);
        } catch (error: unknown) {
            this.logger.error(String(error));
            return;
        }
    }

    async putBlog(blogId: string, entity: any) {

    }
    async delBlog(blogId: string) {

    }

    async createPostToBlog(blogId: string, entity: any) {

    }
}