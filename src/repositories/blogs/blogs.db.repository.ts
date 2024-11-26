import {Blog} from "../../dto/blog/blog.entity";
import {BlogModelClass, PostModelClass} from "../../db/db";
import {LoggerService} from "../../utils/logger/logger.service";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {BlogCreateDto} from "../../dto/blog/blog.create.dto";
import {postMapper} from "../../utils/features/query/get.blogs.query";

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
        try {
            return await BlogModelClass.create(entity);
        } catch (error: unknown) {
            this.logger.error(String(error));
            return;
        }
    }
    async delBlog(blogId: string) {
        try {
            return await BlogModelClass.create(blogId);
        } catch (error: unknown) {
            this.logger.error(String(error));
            return;
        }
    }

    async createPostToBlog(entity: any) {
        try {
            return await PostModelClass.create(entity);
        } catch (error: unknown) {
            this.logger.error(String(error));
            return;
        }
    }
    async findBlogById(blogId: string) {
        try {
            const blog = await BlogModelClass.findById({_id: new ObjectId(blogId)});
            if (!blog){
                return;
            }
            return blog;
        } catch (error: unknown) {
            this.logger.error(String(error));
            return;
        }
    }
    async findPost(postId: string) {
        try {
            const post = await PostModelClass.findById({_id: new ObjectId(postId)});
            if (!post){
                return;
            }
            return postMapper(post);
        } catch (error: unknown) {
            this.logger.error(String(error));
            return;
        }
    }
    async updateBlog(blogDto: BlogCreateDto){
        const {name, description, websiteUrl} = blogDto;
        try {
            const blog = await BlogModelClass.updateOne({
                name, description, websiteUrl
            })
            return blog.modifiedCount === 1;
        } catch (error: unknown) {
            this.logger.error(String(error));
            return;
        }
    }
    async deleteBlog(blogId: string){
        try {
            const blog = await BlogModelClass.deleteOne({
                _id: new ObjectId(blogId)
            })
            return blog.deletedCount === 1;
        } catch (error: unknown) {
            this.logger.error(String(error));
            return;
        }
    }
}