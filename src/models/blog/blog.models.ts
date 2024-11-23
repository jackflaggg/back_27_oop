export interface BlogOutInterface {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}


export type BlogIdParam = {
    id: string
}