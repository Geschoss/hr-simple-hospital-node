({
  method: async (name: string) => {
    return await domain.patient.search(name);
  },
  reject: (error: Error, name: string) => {
    return `Can't find patient! ${name}`;
  },
});
