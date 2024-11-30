import {Blog} from "../../dto/blog/blog.entity";
import {BlogCreateDto} from "../../dto/blog/blog.create.dto";
import {BlogsDbRepository} from "../../repositories/blogs/blogs.db.repository";
import {blogMapper} from "../../utils/features/query/query.helper";
import {PostCreateDto} from "../../dto/post/post.create.dto";
import {ThrowError} from "../../utils/errors/custom.errors";
import {nameErr} from "../../models/common";

export class BlogService {
    constructor(private readonly blogRepository: BlogsDbRepository) {}

    async createBlog(dto: BlogCreateDto){
        const blog = new Blog(dto.name, dto.description, dto.websiteUrl);

        const createDate =  await this.blogRepository.createBlog(blog);

        return blogMapper(createDate)
    }

    async updateBlog(id: string, dto: BlogCreateDto){
        const blog = await this.blogRepository.findBlogById(id);
        if (!blog){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'блог не найден!', field: '[UserDbRepository]'}]);
        }
        return await this.blogRepository.updateBlog(dto);
    }

    async deleteBlog(id: string){
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