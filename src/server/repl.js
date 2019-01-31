const Repl = require('repl');
const net = require('net');
const api = require('./api');

const prompt = 'gem > ';

const start = (socket) => {
  const repl = Repl.start({
    prompt,
    input: socket,
    output: socket,
    terminal: true,
  });

  // define commands...
  // initialize context...
  // listen repl events...

  // socket.on('error', (e) => {});

  repl.on('exit', () => {
    socket.end();
  });

  return repl;
};

const server = net.createServer((socket) => {
  const repl = start(socket);
  repl.context.api = api;
  repl.context.await = (fn) => {
    const loading = setTimeout(() => {
      socket.write('.');
    }, 100);

    Promise.resolve(fn)
      .then((res) => {
        clearTimeout(loading);
        socket.write(`${JSON.stringify(res, null, 2)}\n${prompt}`);
      })
      .catch((err) => {
        clearTimeout(loading);
        socket.write(`${JSON.stringify(err, null, 2)}\n${prompt}`);
      });
  };
});


module.exports = server;
