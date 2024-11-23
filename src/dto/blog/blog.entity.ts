export class Blog {
    createdAt: Date;
    isMembership: boolean;
    constructor(protected name: string, protected description: string, protected websiteUrl: string) {
        this.createdAt = new Date();
        this.isMembership = true;
    }
}