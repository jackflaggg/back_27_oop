import {Blog} from "../../dto/blog/blog.entity";
import {BlogCreateDto} from "../../dto/blog/blog.create.dto";
import {BlogsDbRepository} from "../../repositories/blogs/blogs.db.repository";

export class BlogService {
    constructor(private readonly blogRepository: BlogsDbRepository) {}
    async createBlog(dto: BlogCreateDto){
        const blog = new Blog(dto.name, dto.description, dto.websiteUrl);
        return await this.blogRepository.createBlog(blog)
    }
}