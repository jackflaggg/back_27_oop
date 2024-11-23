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

    async updateBlog(id: string, dto: BlogCreateDto){
        const blog = await this.blogRepository.findBlogById(id);
        if (!blog){
            return {
                status: '-',
                extensions: {message: 'нет блога', field: 'blogRepository'},
                data: null
            }
        }
        const updateBlog = await this.blogRepository.updateBlog(dto);
        if (!updateBlog){
            return {
                status: '-',
                extensions: {message: 'не получилось обновить', field: 'blogRepository'},
                data: null
            }
        }
        return {
            status: '+',
            data: updateBlog
        }
    }

    async deleteBlog(id: string){
        const blog = await this.blogRepository.findBlogById(id);
        if (!blog){
            return {
                status: '-',
                extensions: {message: 'нет блога', field: 'blogRepository'},
                data: null
            }
        }
        const deleteBlog = await this.blogRepository.deleteBlog(id);
        if (!deleteBlog){
            return {
                status: '-',
                extensions: {message: 'не получилось удалить', field: 'blogRepository'},
                data: null
            }
        }
        return {
            status: '+',
            data: deleteBlog
        }
    }
}