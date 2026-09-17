const fastify = require('fastify')({ logger: true });
const path = require('path');

fastify.register(require('@fastify/formbody'));

fastify.register(require('@fastify/view'), {
  engine: { ejs: require('ejs') },
  root: path.join(__dirname, 'views'),
});

let todos = [
  { id: 1, text: 'Aprender Fastify', done: false },
  { id: 2, text: 'Configurar EJS', done: true }
];

fastify.get('/', async (request, reply) => {
  return reply.view('index.ejs', { 
    todos, 
    title: 'Repositorio Oficial: pr-forks', 
    author: 'Valentina' 
  });
});

fastify.post('/add', async (request, reply) => {
  const { text, category } = request.body;
  if (text) {
    const newTodo = {
      id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
      text,
      category: category || 'personal',
      done: false
    };
    todos.push(newTodo);
  }
  return reply.redirect('/');
});

fastify.post('/toggle/:id', async (request, reply) => {
  const { id } = request.params;
  const todo = todos.find(t => t.id === parseInt(id));
  if (todo) {
    todo.done = !todo.done;
  }
  return reply.redirect('/');
});

fastify.post('/delete/:id', async (request, reply) => {
  const { id } = request.params;
  todos = todos.filter(t => t.id !== parseInt(id));
  return reply.redirect('/');
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
