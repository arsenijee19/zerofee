import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { getEnv } from "@/lib/server/env";

export interface ObjectStorage {
  provider: "local" | "s3";
  put(key: string, bytes: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
}

const keyPattern = /^[a-zA-Z0-9][a-zA-Z0-9/_.-]{3,200}$/;

function assertKey(key: string) {
  if (!keyPattern.test(key) || key.includes("..") || key.includes("//")) throw new Error("Invalid storage key");
}

class LocalStorage implements ObjectStorage {
  provider = "local" as const;
  constructor(private readonly root: string) {}

  private resolveKey(key: string) {
    assertKey(key);
    const full = resolve(this.root, key);
    if (!full.startsWith(resolve(this.root) + sep)) throw new Error("Invalid storage key");
    return full;
  }

  async put(key: string, bytes: Buffer) {
    const path = this.resolveKey(key);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, bytes, { flag: "wx" });
  }

  async get(key: string) {
    return readFile(this.resolveKey(key));
  }

  async delete(key: string) {
    await rm(this.resolveKey(key), { force: true });
  }
}

/** S3-compatible adapter (AWS S3, Cloudflare R2, Backblaze B2, MinIO). Loaded lazily so local dev needs no AWS SDK. */
class S3Storage implements ObjectStorage {
  provider = "s3" as const;
  private clientPromise?: Promise<{ client: import("@aws-sdk/client-s3").S3Client; sdk: typeof import("@aws-sdk/client-s3") }>;

  private async ctx() {
    this.clientPromise ??= import("@aws-sdk/client-s3").then((sdk) => ({
      sdk,
      client: new sdk.S3Client({
        region: process.env.S3_REGION || "auto",
        endpoint: process.env.S3_ENDPOINT || undefined,
        forcePathStyle: Boolean(process.env.S3_ENDPOINT),
        credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "", secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "" }
      })
    }));
    return this.clientPromise;
  }

  private bucket() {
    const bucket = process.env.S3_BUCKET;
    if (!bucket) throw new Error("S3_BUCKET is not configured");
    return bucket;
  }

  async put(key: string, bytes: Buffer, contentType: string) {
    assertKey(key);
    const { client, sdk } = await this.ctx();
    await client.send(new sdk.PutObjectCommand({ Bucket: this.bucket(), Key: key, Body: bytes, ContentType: contentType, CacheControl: "private, max-age=0" }));
  }

  async get(key: string) {
    assertKey(key);
    const { client, sdk } = await this.ctx();
    const result = await client.send(new sdk.GetObjectCommand({ Bucket: this.bucket(), Key: key }));
    if (!result.Body) throw new Error("Object not found");
    return Buffer.from(await result.Body.transformToByteArray());
  }

  async delete(key: string) {
    assertKey(key);
    const { client, sdk } = await this.ctx();
    await client.send(new sdk.DeleteObjectCommand({ Bucket: this.bucket(), Key: key }));
  }
}

let storage: ObjectStorage | undefined;

export function getStorage(): ObjectStorage {
  if (storage) return storage;
  const env = getEnv();
  if (env.MEDIA_STORAGE_PROVIDER === "s3") {
    if (!process.env.S3_BUCKET || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) throw new Error("MEDIA_STORAGE_PROVIDER=s3 requires S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY");
    storage = new S3Storage();
  } else {
    storage = new LocalStorage(join(process.cwd(), process.env.MEDIA_LOCAL_DIR || "storage/mock"));
  }
  return storage;
}
