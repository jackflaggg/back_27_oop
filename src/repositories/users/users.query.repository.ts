import {UserModelClass} from "../../db/db";
import {transformUserToOut} from "../../utils/features/mappers/user.mapper";

export class UsersQueryRepository {
    async getAllUsers(query: any) {
        const {searchNameTerm, sortBy, sortDirection, pageSize, pageNumber} = query;

        const users = await UserModelClass
            .find(searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {})
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const totalCountBlogs = await UserModelClass.countDocuments(searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {});

        const pageCount = Math.ceil(totalCountBlogs / pageSize);

        return {
            pagesCount: Number(pageCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: Number(totalCountBlogs),
            items: users ? users.map(user => transformUserToOut(user)) : []
        }
    }

    async getUserById(id: string) {
        if (id) return id
        return null
    }
}