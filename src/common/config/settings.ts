import {config} from 'dotenv'
config()

export const SETTINGS = {
    PORT: process.env.PORT || 5007,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        AUTH: '/auth',
        COMMENTS: '/comments',
        TESTING: '/testing',
        SECURITY_DEVICES: '/security',
        VERCEL: '/'
    },
    DB_NAME: 'back',
    COLLECTION_POSTS: process.env.POST_COLLECTION_NAME || 'posts',
    COLLECTION_BLOGS: process.env.BLOG_COLLECTION_NAME || 'blogs',
    COLLECTION_USERS: process.env.COLLECTION_USERS || 'users',
    COLLECTION_COMMENTS: process.env.COMMENTS_COLLECTION_NAME || 'comments',
    COLLECTION_DEVICES: process.env.SECURITY_DEVICES_COLLECTION_NAME || 'recoverypasswords',
    COLLECTION_SESSIONS: process.env.SESSION_COLLECTION_NAME || 'sessions',
    COLLECTION_STATUSES: process.env.COLLECTION_STATUSES || 'status',
    ADMIN: process.env.ADMIN || 'admin:qwerty',
    SECRET_KEY: process.env.SECRET_KEY || '',
    TOKEN_DURATION: process.env.TOKEN_DURATION || '',
    EMAIL_NAME: process.env.EMAIL_USER_ACCOUNT!,
    PASS: process.env.PASS_USER_ACCOUNT!,
    HOST: process.env.HOST || '',
    NAME_SUBJECT: process.env.NAME_SUBJECT || '',
    EXPIRES_IN_ACCESS_TOKEN: process.env.EXPIRES_IN_ACCESS_TOKEN || '5m',
    EXPIRES_IN_REFRESH_TOKEN: process.env.EXPIRES_IN_REFRESH_TOKEN || '24h',
    userAgent: process.env.USER_AGENT,
    ipTest: process.env.IP_TEST,
    MONGO_URL: process.env.MONGO_URL,
    DB_URI_TEST: process.env.DB_URI_TEST,
    SALT: 10
}