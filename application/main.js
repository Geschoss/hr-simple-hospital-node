const { Appliction } = require('../framework');

const PORT = process.env.PORT || 8000;

new Appliction({
  port: PORT,
}).start();
