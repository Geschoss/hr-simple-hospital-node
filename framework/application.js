const path = require('path');
const WSServer = require('./server');
const { Interfaces, Libraries } = require('./loaders');

class Appliction {
  constructor({ logger = console, port }) {
    this.port = port;
    this.console = logger;

    this.root = process.cwd();
    this.path = path.join(this.root, 'application');

    this.context = {};
    this.lib = new Libraries(this, 'lib', { require });
    this.db = new Libraries(this, 'db', { process });
    this.domain = new Libraries(this, 'domain');
    this.api = new Interfaces(this, 'api');
    this.server = new WSServer(this, { port });
  }

  async start() {
    this.sandbox = this.createSandbox();
    await this.lib.load();
    await this.db.load();
    await this.domain.load();
    await this.api.load();

    await this.server.start();
  }

  createSandbox() {
    const { console } = this;
    const sandbox = { console };
    sandbox.context = this.context;
    sandbox.api = this.api.tree;
    sandbox.lib = this.lib.tree;
    sandbox.db = this.db.tree;
    sandbox.domain = this.domain.tree;
    return sandbox;
  }

  absolute(relative) {
    return path.join(this.path, relative);
  }
}

module.exports = Appliction;
