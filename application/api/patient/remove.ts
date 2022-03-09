({
  method: async (id: number) => {
    await domain.patient.delete(id);
  },
  reject: (error: Error, id: number) => {
    return `Can't remove patient by id: ${id}`;
  },
});
