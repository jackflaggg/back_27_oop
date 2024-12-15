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

    async createPostToBlog(blog: any, post: PostCreateDto): Promise<postMapperInterface>{
        const { title, shortDescription, content, blogId } = post;

        const newPost = new Post(title, shortDescription, content, blogId, blog.name)

        const postMap = newPost.viewModel()

        return await this.blogRepository.createPostToBlog(postMap);
    }

    async findByPostId(id: string): Promise<postMapperInterface | void>{
        const post = await this.blogRepository.findPost(id);
        if (!post){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'пост не найден!', field: '[PostDbRepository]'}])
        }
        return post;
    }
}