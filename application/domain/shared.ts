({
  rooms: new Map<string, Set<WSClient>>(),

  getRoom(name: string) {
    let room = domain.shared.rooms.get(name);
    if (room) return room;
    room = new Set();
    domain.shared.rooms.set(name, room);
    return room;
  },

  send(sender: WSClient, name: string, message: string) {
    const room = domain.shared.getRoom(name);
    for (const client of room) {
      if (sender !== client) {
        client.notify({ room: name, message });
      }
    }
  },
});
