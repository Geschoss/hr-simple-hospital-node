({
  method: async () => {
    return await domain.patient.list();
  },
  reject: (error: Error) => {
    return "Can't get patterns!";
  },
});
