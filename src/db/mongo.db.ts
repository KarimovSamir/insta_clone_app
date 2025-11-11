import { Collection, Db, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";
import { Blog } from "../blogs/domain/blog";
import { Post } from "../posts/domain/post";
import { User } from "../users/domain/user";
import { Comment } from "../comments/domain/comment";
import { BlacklistRefToken } from "../auth/domain/blacklistRefToken";
import { DeviceSession } from "../device_sessions/domain/device-session";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";
const USER_COLLECTION_NAME = "users";
const COMMENT_COLLECTION_NAME = "comments";
const BLACKLIST_REF_TOKEN_COLLECTION_NAME = "blacklist_ref_token";
const DEVICE_SESSIONS = "device_sessions";

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<Comment>;
export let blacklistRefTokenCollection: Collection<BlacklistRefToken>;
export let deviceSessionsCollection: Collection<DeviceSession>;

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
        commentCollection = db.collection<Comment>(COMMENT_COLLECTION_NAME);
        blacklistRefTokenCollection = db.collection<BlacklistRefToken>(BLACKLIST_REF_TOKEN_COLLECTION_NAME);
        deviceSessionsCollection = db.collection<DeviceSession>(DEVICE_SESSIONS);

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