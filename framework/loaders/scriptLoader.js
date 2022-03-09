'use strict';

const path = require('path');
const fsp = require('fs').promises;
const ts = require('typescript');
const { createScript } = require('./vm');

class ScriptLoader {
  constructor(path, application) {
    this.path = application.absolute(path);
    this.application = application;
  }

  async load(targetPath = this.path) {
    this.application.console.log(`Load script from ${targetPath}`);
    try {
      const files = await fsp.readdir(targetPath, {
        withFileTypes: true,
      });
      for (const file of files) {
        if (file.name.startsWith('.')) continue;
        if (file.name.endsWith('.d.ts')) continue;
        const filePath = path.join(targetPath, file.name);
        if (file.isDirectory()) {
          await this.load(filePath);
        } else {
          await this.register(filePath);
        }
      }
    } catch (err) {
      this.application.console.error(err.stack);
    }
  }

  async createScript(fileName, context = {}) {
    try {
      let sourceCode = await fsp.readFile(fileName, 'utf8');
      if (!sourceCode) {
        return null;
      }
      // TODO make buity again
      const isTs = fileName.endsWith('.ts');
      const isTsx = fileName.endsWith('.tsx');
      if (isTs || isTsx) {
        sourceCode = ts.transpile(sourceCode, {
          target: 99,
        });
      }
      // TODO мб зависить только он аргумента
      const options = {
        context: {
          ...this.application.sandbox,
          ...context,
        },
      };
      const script = createScript(fileName, sourceCode, options);
      return script;
    } catch (err) {
      if (err.sourceCode !== 'ENOENT') {
        this.application.console.error(err.stack);
      }
      return null;
    }
  }

  getRelPath(filePath) {
    return filePath.substring(this.path.length + 1);
  }
}

module.exports = ScriptLoader;
