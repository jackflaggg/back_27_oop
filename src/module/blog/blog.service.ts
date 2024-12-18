import "reflect-metadata";
import {nameErr} from "../../common/types/common";
import {BlogCreateDto} from "./dto/blog.create.dto";
import {Blog} from "./dto/blog.entity";
import {PostCreateDto} from "../post/dto/post.create.dto";
import {BlogsDbRepository} from "./blogs.db.repository";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {blogMapperInterface, postMapperInterface} from "../../common/utils/features/query.helper";
import {inject, injectable} from "inversify";
import {TYPES} from "../../common/types/types";
import {Post} from "../post/dto/post.entity";
import {UserInfo} from "node:os";
import {userInterface} from "../user/models/user.models";

@injectable()
export class BlogService {
    constructor(@inject(TYPES.BlogsDbRepo) private readonly blogRepository: BlogsDbRepository) {}

    async createBlog(dto: BlogCreateDto): Promise<blogMapperInterface> {
        const blog = new Blog(dto.name, dto.description, dto.websiteUrl);

        return await this.blogRepository.createBlog(blog);
    }

    async updateBlog(id: string, dto: BlogCreateDto): Promise<boolean> {
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

    async findBlogById(id: string): Promise<blogMapperInterface | void>{
        const blog = await this.blogRepository.findBlogById(id);
        if (!blog){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'блог не найден!', field: '[BlogDbRepository]'}])
        }
        return blog
    }

    async createPostToBlog(blogName: string, post: PostCreateDto, user: userInterface | null): Promise<any/*postMapperInterface*/>{
        const { title, shortDescription, content, blogId } = post;

        const newPost = new Post(title, shortDescription, content, blogId, blogName)

        const postResult = await this.blogRepository.createPostToBlog(newPost);
        return await this.blogRepository.findPost(postResult.id, user?.userId);
    }
}