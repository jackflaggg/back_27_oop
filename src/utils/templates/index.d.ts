declare global {
    namespace Express {
        export interface Request {
            userId?: any | null | string
        }
    }
}