import {Blog} from "../../dto/blog/blog.entity";
import {BlogModelClass, PostModelClass} from "../../db/db";
import {LoggerService} from "../../utils/logger/logger.service";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {BlogCreateDto} from "../../dto/blog/blog.create.dto";
import {postMapper} from "../../utils/features/query/query.helper";

export class BlogsDbRepository {
    constructor(private readonly logger: LoggerService) {
    }
    async createBlog(entity: Blog){
        return await BlogModelClass.create(entity);
    }

    async putBlog(blogId: string, entity: any) {
        return await BlogModelClass.create(entity);
    }
    async delBlog(blogId: string) {
        return await BlogModelClass.create(blogId);

    }

    async createPostToBlog(entity: any) {
        return await PostModelClass.create(entity);
    }
    async findBlogById(blogId: string) {
        const blog = await BlogModelClass.findById({_id: new ObjectId(blogId)});
        if (!blog){
            return;
        }
        return blog;
    }
    async findPost(postId: string) {
        const post = await PostModelClass.findById({_id: new ObjectId(postId)});
        if (!post){
            return;
        }
        return postMapper(post);
    }
    async updateBlog(blogDto: BlogCreateDto){
        const {name, description, websiteUrl} = blogDto;
        const blog = await BlogModelClass.updateOne({
            name, description, websiteUrl
        })
        return blog.modifiedCount === 1;
    }
    async deleteBlog(blogId: string){
        const blog = await BlogModelClass.deleteOne({
            _id: new ObjectId(blogId)
        })
        return blog.deletedCount === 1;
    }
}