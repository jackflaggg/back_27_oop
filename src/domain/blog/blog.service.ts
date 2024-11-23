import {Blog} from "../../dto/blog/blog.entity";
import {BlogCreateDto} from "../../dto/blog/blog.create.dto";
import {BlogsDbRepository} from "../../repositories/blogs/blogs.db.repository";
import {blogMapper} from "../../utils/features/query/get.blogs.query";

export class BlogService {
    constructor(private readonly blogRepository: BlogsDbRepository) {}
    async createBlog(dto: BlogCreateDto){
        const blog = new Blog(dto.name, dto.description, dto.websiteUrl);
        const createDate =  await this.blogRepository.createBlog(blog);
        if (!createDate){
            return {
                status: '-',
                extensions: {message: '', field: ''},
                data: null
            }
        }
        return {
            status: '+',
            data: blogMapper(createDate)
        }
    }
}