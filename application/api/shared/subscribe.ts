({
  method: async (room: string) => {
    const clients = domain.shared.getRoom(room);
    clients.add(context.client);
    context.client.onClose(() => {
      clients.delete(context.client);
    });
  },
  reject: (error: Error, room: string) => {
    return `Can't subscribe to ${room}`;
  },
});
