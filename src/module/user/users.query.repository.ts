import {UserModelClass} from "../../common/database";
import {transformUserToOut} from "../../common/utils/mappers/user.mapper";
import {ObjectId} from "mongodb";

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
        const result = await UserModelClass.findOne({_id: new ObjectId(id)});
        if (!result){
            return;
        }
        return {
            userId: result._id,
            userLogin: result.login,
            userEmail: result.email
        }
    }
}