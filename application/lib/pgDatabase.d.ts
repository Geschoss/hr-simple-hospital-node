declare type Database = {
  insert<R = unknown>(table: string, record: object): Modify<R>;
  select<R = unknown>(
    table: string,
    fields: Array<string>,
    ...conditions: Array<object>
  ): Promise<R>;
  update<R = unknown>(
    table: string,
    delta: object,
    ...conditions: Array<object>
  ): Modify<R>;
};

type DatabaseOptions = {
  connectionString: string;
  ssl?: {
    rejectUnauthorized: boolean;
  };
};

declare type PGDatabase = {
  create: (options: DatabaseOptions) => Database;
};
type Modify<R> = {
  returning(field: string | Array<string>): Promise<R>;
  then(resolve: (rows: Array<object>) => void, reject: Function): void;
};
