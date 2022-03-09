type Payload = { room: string; message: string };

({
  method: async ({ room, message }: Payload) => {
    domain.shared.send(context.client, room, message);
  },
  reject: (error: Error, payload: Payload) => {
    return `Can't send message to ${payload.room}`;
  },
});
