const WebSocket = require('ws');

class WSClient {
  constructor(socket) {
    this.socket = socket;
  }

  send(payload) {
    this.socket.send(JSON.stringify(payload));
  }

  notify(payload) {
    this.send({ status: 'ok', payload });
  }

  onClose(cb) {
    this.socket.on('close', cb);
  }
}

const bufferToJson = (buffer) => JSON.parse(buffer.toString());
class WSServer {
  constructor(application, { port }) {
    this.port = port;
    this.application = application;
    this.sockets = new Set();
  }

  start() {
    const server = new WebSocket.Server({ port: this.port });

    server.on('connection', (socket) => {
      this.sockets.add(socket);
      this.application.console.log(`New connetcion`);
      this.application.console.log(`Connection count: ${this.sockets.size}`);
      socket.on('close', () => {
        this.sockets.delete(socket);
        this.application.console.log(`Connetcion close`);
        this.application.console.log(`Connection count: ${this.sockets.size}`);
      });
      const client = new WSClient(socket);
      socket.on('message', (data) => this.onData(client, data));
    });

    server.on('error', (err) => {
      this.application.console.log('Server error', err);
    });

    this.application.console.log(
      `Server start on: http://localhost:${this.port}/`
    );
  }

  async onData(client, buffer) {
    try {
      const { method, payload } = bufferToJson(buffer);
      const api = this.application.api.tree[method];
      this.application.context.client = client;
      const response = await this.makeResponse(api, method, payload);
      delete this.application.context.client;
      client.send(response);
    } catch (error) {
      this.application.console.error({ error });
    }
  }

  async makeResponse(api, method, payload) {
    // TODO simplify
    if (!api) {
      const error = `Unknown method: ${method}`;
      this.application.console.error(error);
      return { status: 'error', error };
    }
    try {
      const response = await api.method(payload);
      return {
        status: 'ok',
        payload: response,
      };
    } catch (error) {
      this.application.console.error(`Error in method${method}!`, error);
      if (!api.reject) {
        return { status: 'error' };
      }
      const errorMsg = api.reject(error, payload);
      return { status: 'error', error: errorMsg };
    }
  }
}

module.exports = WSServer;
