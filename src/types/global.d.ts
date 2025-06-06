import { Connection, Promise as MongoosePromise } from 'mongoose';

interface MongooseConnection {
  conn: Connection | null;
  promise: MongoosePromise<Connection> | null;
}

declare global {
  const mongoose: MongooseConnection | undefined;
}

if (!global.mongoose) {
  console.log(`[2025-06-06 16:30:25] Initializing mongoose connection by Derayzeeee`);
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

export {};