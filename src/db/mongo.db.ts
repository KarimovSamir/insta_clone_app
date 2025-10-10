import { Collection, Db, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";
import { Blog } from "../blogs/domain/blog";
import { Post } from "../posts/domain/post";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;

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