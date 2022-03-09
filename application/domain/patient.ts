({
  list: async () => {
    return await db.pg.select<Patient[]>('Patient', ['*'], {
      archived: false,
    });
  },
  search: async (name: string) => {
    return await db.pg.select<Patient[]>('Patient', ['*'], {
      name: `*${name}*`,
    });
  },
  delete: async (id: number) => {
    await db.pg.update('Patient', { archived: true }, { id });
  },
  create: async ({ fullName, sex, bithday, address, OMS }: Patient) => {
    return await db.pg
      .insert<Patient>('Patient', {
        fullName,
        sex,
        bithday,
        address,
        OMS,
        archived: false,
      })
      .returning('*');
  },
});
