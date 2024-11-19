import {UserModelClass} from "../../db/db";
import {
    loginUserMapper,
    transformUserToLogin,
    transformUserToOut,
    userMapperToOutput
} from "../../utils/mappers/user.mapper";
import {ObjectId} from "mongodb";
import {queryHelperToUser} from "../../utils/helpers/helper.query.get";
import {InQueryUserModel} from "../../models/user/helper-query-user/helper.user";
import {
    OutLoginMapByUser,
    OutQueryCreateUsersModel,
    OutUserById
} from "../../models/user/ouput/output.type.users";

export const usersQueryRepository = {
    async getAllUsers(query: InQueryUserModel): Promise<Omit<OutQueryCreateUsersModel, 'items.emailConfirmation'>> {
        const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = queryHelperToUser(query);

        const filter = {
            $or: [
                searchLoginTerm ? { login: { $regex: searchLoginTerm, $options: 'i' }} : {},
                searchEmailTerm ? { email: { $regex: searchEmailTerm, $options: 'i' }} : {}
            ]
        };

        const AllUsers = await UserModelClass
            .find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1} )
            .skip((Number(pageNumber) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .lean();

        const totalCountsUsers = await UserModelClass.countDocuments(filter);

        const pagesCount = Math.ceil(totalCountsUsers / Number(pageSize));

        return {
            pagesCount: Number(pagesCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: Number(totalCountsUsers),
            items: AllUsers.map(user => transformUserToOut(user)),
        };
    },

    async getUserById(id: string): Promise<OutUserById | null> {

        const user = await UserModelClass.findOne({_id: new ObjectId(id)});
        if (!user) {
            return null;
        }
        return transformUserToOut(user);
    },

    async LoginMapByUser(userId: string): Promise<OutLoginMapByUser | null> {
        const loginUser = await this.getUserById(userId);
        if (!loginUser) {
            return null;
        }
        return transformUserToLogin(loginUser);
    }
}