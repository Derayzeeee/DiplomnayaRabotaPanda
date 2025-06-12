import mongoose from 'mongoose';

/**
 * Interface for the global mongoose connection
 * @author Derayzeeee
 * @date 2025-06-06 17:47:50
 */
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseGlobal: MongooseConnection | undefined;
}

const cached = global.mongooseGlobal || {
  conn: null,
  promise: null
};

if (!global.mongooseGlobal) {
  global.mongooseGlobal = cached;
}

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/PandaShop';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Connects to MongoDB and caches the connection
 * @returns Promise<typeof mongoose>
 */
async function dbConnect(): Promise<typeof mongoose> {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    const instance = await cached.promise;
    cached.conn = instance;

    return instance;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;