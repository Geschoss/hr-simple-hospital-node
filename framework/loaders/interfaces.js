'use strict';

const path = require('path');
const ScriptLoader = require('./scriptLoader');

class Interfaces extends ScriptLoader {
  constructor(application, path) {
    super(path, application);
    this.tree = {};
  }

  async register(filePath) {
    const api = await this.createScript(filePath);
    const relPath = this.getRelPath(filePath);
    const [path] = relPath.split('.');
    this.tree[`/${path}`] = api;
  }
}

module.exports = { Interfaces };
