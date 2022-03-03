import http from 'http';

const routing = {
  '/': async () => ({ name: 'Pavel' }),
  '/user/name': async () => 'Pavel',
};


const PORT = process.env.PORT || 8000
const logger = console;

const server = http.createServer(async (req, res) => {
  console.log(`New fetch to: ${req.url}`);
  const handler = routing[req.url];

  if (!handler) {
    res.writeHead(404);
    res.end('Path not found');
    return;
  }

  const response = await handler();
  const responseStr = JSON.stringify(response);
  res.writeHead(200);
  res.end(responseStr);
})

logger.log(`Server start on: http://localhost:${PORT}/`)
server.listen(PORT);