// TODO придумать динамические подгрузки типов
declare type Domain = {
  patient: PatientDomain;
  shared: SharedDomain;
};

declare const domain: Domain;

declare type DB = {
  pg: Database;
};

declare const db: DB;

declare type Lib = {
  pgDatabase: PGDatabase;
};

declare const lib: Lib;

declare type Context = {
  client: Socket;
};

declare const context: Context;
