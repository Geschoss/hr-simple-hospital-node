'use strict';

const ScriptLoader = require('./scriptLoader');

class Libraries extends ScriptLoader {
  constructor(application, path, context = {}) {
    super(path, application);
    this.context = context;
    this.tree = {};
  }

  async register(filePath) {
    const initLib = await this.createScript(filePath, this.context);
    let exports;
    if (typeof initLib === 'function') {
      exports = await initLib();
    } else {
      exports = initLib;
    }
    const relPath = this.getRelPath(filePath);
    const [path] = relPath.split('.');
    this.tree[path] = exports;
  }
}

module.exports = {
  Libraries,
};
