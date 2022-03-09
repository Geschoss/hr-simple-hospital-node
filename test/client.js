'use strict';
const WebSocket = require('ws');

const net = require('net');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

const rl = readline.createInterface({ input: stdin, output: stdout });
const socket = new WebSocket('ws://localhost:8000');

const api = {
  subscribe: () => ({
    method: '/shared/subscribe',
    payload: 'doc1',
  }),
  send: (message) => ({
    method: '/shared/send',
    payload: {
      room: 'doc1',
      message,
    },
  }),
  list: () => ({
    method: '/patient/list',
  }),
  create: () => ({
    method: '/patient/create',
    payload: {
      fullName: 'pako',
      sex: 'man',
      bithday: '1990-03-04',
      address: 'Moon',
      OMS: '555667010800004Х',
    },
  }),
  remove: ([id]) => ({
    method: '/patient/remove',
    payload: id,
  }),
  default: (method) => ({
    method: `${method}`,
  }),
};

socket.on('message', (message) => {
  const { status, payload, error } = JSON.parse(message.toString());
  console.log({ status, payload, error });
});

socket.on('close', () => {
  process.exit(0);
});

(async () => {
  let availbleApi = Object.keys(api);
  let answer = '';
  do {
    console.log({ availbleApi });
    answer = await rl.question('> ');
    const [method, ...args] = answer.split(' ');
    let handler = api[method];
    if (!handler) {
      handler = api.default;
    }
    const msg = handler(...args);
    const res = JSON.stringify(msg);
    socket.send(res);
    continue;
  } while (answer !== 'q');

  rl.close();
})();
