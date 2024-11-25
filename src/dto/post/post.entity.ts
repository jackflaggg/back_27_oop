export class Post {
    createdAt: Date;
    constructor(protected name: string, protected description: string, protected websiteUrl: string) {
        this.createdAt = new Date();
    }
}