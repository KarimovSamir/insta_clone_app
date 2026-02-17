import { Collection, Db, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";
import { Blog } from "../blogs/domain/blog";
import { Post } from "../posts/domain/post";
import { User } from "../users/domain/user";
import { Comment, CommentLikeDislikeStatus } from "../comments/domain/comment";
import { BlacklistRefToken } from "../auth/domain/blacklistRefToken";
import { DeviceSession } from "../device_sessions/domain/device-session";
import { RateLimitRecord } from "../auth/domain/rate-limit-record";
import { PostLikeStatus } from "../posts/domain/post.likes";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";
const USER_COLLECTION_NAME = "users";
const COMMENT_COLLECTION_NAME = "comments";
const BLACKLIST_REF_TOKEN_COLLECTION_NAME = "blacklist_ref_token";
const DEVICE_SESSIONS = "device_sessions";
const RATE_LIMIT_COLLECTION_NAME = "rate_limit";
const COMMENT_LIKES_COLLECTION_NAME = "comment_likes";
const POST_LIKES_COLLECTION_NAME = "post_likes";

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<Comment>;
export let blacklistRefTokenCollection: Collection<BlacklistRefToken>;
export let deviceSessionsCollection: Collection<DeviceSession>;
export let rateLimitCollection: Collection<RateLimitRecord>;
export let commentLikeDislikeStatusCollection: Collection<CommentLikeDislikeStatus>;
export let postLikeStatusCollection: Collection<PostLikeStatus>;

// Кэшируем подключение между инвокациями функции
let clientPromise: Promise<MongoClient> | null = null;

// Промис «готовности БД», чтобы маршруты могли дождаться инициализации.
// Если другой кусок кода начнёт работать между моментом «подключение установлено» (clientPromise)
// и моментом «переменная присвоена» (postCollection), он увидит postCollection === undefined и упадёт
export let dbReady: Promise<void> | null = null;

export function runDB(url: string): Promise<void> {
    if (!clientPromise) {
        client = new MongoClient(url);
        clientPromise = client.connect();
    }

    // Инициализируем коллекции один раз и сохраняем промис
    if (!dbReady) {
        dbReady = (async () => {
            try {
                client = await clientPromise!;
                const db: Db = client.db(SETTINGS.DB_NAME);

                blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
                postCollection = db.collection<Post>(POST_COLLECTION_NAME);
                userCollection = db.collection<User>(USER_COLLECTION_NAME);
                commentCollection = db.collection<Comment>(
                    COMMENT_COLLECTION_NAME,
                );
                blacklistRefTokenCollection = db.collection<BlacklistRefToken>(
                    BLACKLIST_REF_TOKEN_COLLECTION_NAME,
                );
                deviceSessionsCollection =
                    db.collection<DeviceSession>(DEVICE_SESSIONS);
                rateLimitCollection = db.collection<RateLimitRecord>(
                    RATE_LIMIT_COLLECTION_NAME,
                );
                commentLikeDislikeStatusCollection = db.collection<CommentLikeDislikeStatus>(COMMENT_LIKES_COLLECTION_NAME);
                postLikeStatusCollection = db.collection<PostLikeStatus>(POST_LIKES_COLLECTION_NAME);

                // TTL индексы
                // уникальный индекс по deviceId
                await deviceSessionsCollection.createIndex(
                    { deviceId: 1 },
                    { unique: true },
                );
                // mongo примерно раз в 60 секунд делает чистку. МЫ не контролируем пробег самого mongo
                // но мы контролируем, когда он удаляет через поле expireAfterSeconds (в секундах)
                await blacklistRefTokenCollection.createIndex(
                    { exp: 1 },
                    { expireAfterSeconds: 0 }, // документ удалится ровно в момент exp, когда сам монго сделает свой пробег TTL
                );
                // Тут, при expireAfterSeconds: 60 мы добавляет к exp ещё 60 секунд
                // То есть, грубо говоря, запись удалить на втором пробеге TTL (60 секунд + 60 секунд)
                // Если коротко, то монго удаляет всё у кого протух exp каждые 60 секунд при пробеге TTL
                await rateLimitCollection.createIndex(
                    { date: 1 },
                    { expireAfterSeconds: 60 },
                );

                await db.command({ ping: 1 });
                console.log("✅ Connected to the database");
            } catch (e) {
                console.error("❌ Database not connected:", e);
                // не оставляем висящее состояние
                dbReady = null;
                throw e;
            }
        })();
    }

    return dbReady;
}

export async function stopDb() {
    if (!client) throw new Error("❌ No active client");
    await client.close();
}
