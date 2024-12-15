import {UserModelClass} from "../../common/database";
import {transformUserToOut} from "../../common/utils/mappers/user.mapper";
import {ObjectId} from "mongodb";
import {QueryUsersOutputInterface} from "../../common/utils/features/query.helper";
import {userInterface, getAllUser, userQueryRepoInterface} from "./models/user.models";
import {injectable} from "inversify";

@injectable()
export class UsersQueryRepository implements userQueryRepoInterface{
    async getAllUsers(query: QueryUsersOutputInterface): Promise<getAllUser> {
        const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageSize, pageNumber} = query;

        const filter = {
            $or: [
                searchLoginTerm ? { login: { $regex: searchLoginTerm, $options: 'i' }} : {},
                searchEmailTerm ? { email: { $regex: searchEmailTerm, $options: 'i' }} : {}
            ]
        };

        const users = await UserModelClass
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const totalCountBlogs = await UserModelClass.countDocuments(searchLoginTerm ? {name: {$regex: searchLoginTerm, $options: 'i'}} : {});

        const pageCount = Math.ceil(totalCountBlogs / pageSize);

        return {
            pagesCount: Number(pageCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: Number(totalCountBlogs),
            items: users ? users.map(user => transformUserToOut(user)) : []
        }
    }

    async getUserById(id: string): Promise<userInterface | void> {
        const result = await UserModelClass.findOne({_id: new ObjectId(id)});
        if (!result){
            return;
        }
        return {
            userId: result._id,
            userLogin: result.login!,
            userEmail: result.email!
        }
    }
}