import {nameErr} from "../../models/common";
import {BlogCreateDto} from "./dto/blog.create.dto";
import {Blog} from "./dto/blog.entity";
import {PostCreateDto} from "../post/dto/post.create.dto";
import {BlogsDbRepository} from "./blogs.db.repository";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {blogMapper} from "../../common/utils/features/query.helper";
import {inject, injectable} from "inversify";
import {TYPES} from "../../models/types/types";

@injectable()
export class BlogService {
    constructor(@inject(TYPES.BlogsDbRepo) private readonly blogRepository: BlogsDbRepository) {}

    async createBlog(dto: BlogCreateDto){
        const blog = new Blog(dto.name, dto.description, dto.websiteUrl);

        return await this.blogRepository.createBlog(blog);
    }

    async updateBlog(id: string, dto: BlogCreateDto){
        const blog = await this.blogRepository.findBlogById(id);
        if (!blog){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'блог не найден!', field: '[UserDbRepository]'}]);
        }
        return await this.blogRepository.updateBlog(dto);
    }

    async deleteBlog(id: string): Promise<boolean> {
        const blog = await this.blogRepository.findBlogById(id);

        if (!blog){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'блог не найден!', field: '[UserDbRepository]'}])
        }

        return await this.blogRepository.deleteBlog(id);
    }

    async findBlogById(id: string){
        return await this.blogRepository.findBlogById(id);
    }

    async createPostToBlog(blog: any, post: PostCreateDto){
        const { title, shortDescription, content, blogId } = post;
        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
            createdAt: new Date(),
        }

        return await this.blogRepository.createPostToBlog(newPost);
    }

    async findByPostId(id: string){
        return await this.blogRepository.findPost(id);
    }
}