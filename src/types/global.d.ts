import { Connection, Promise as MongoosePromise } from 'mongoose';

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: MongoosePromise<Connection> | null;
  } | undefined;
}

export {};