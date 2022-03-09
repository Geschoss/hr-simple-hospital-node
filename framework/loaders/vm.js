'use strict';
const vm = require('vm');

const RUN_OPTIONS = { timeout: 5000, displayErrors: false };
const USE_STRICT = `'use strict';\n`;

const createScript = (name, src, options) => {
  const code = USE_STRICT + src;
  const scriptOptions = {
    filename: name,
    ...options,
    lineOffset: 0,
  };
  const script = new vm.Script(code, scriptOptions);
  const context = vm.createContext(options.context, {});
  return script.runInContext(context, RUN_OPTIONS);
};

module.exports = {
  createScript,
};
