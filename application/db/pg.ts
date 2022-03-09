async () => {
  // TODO добавить пароль из
  const options = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        connectionString: 'postgresql://test:test@127.0.0.1:5432/hospital',
      };

  return lib.pgDatabase.create(options);
};
