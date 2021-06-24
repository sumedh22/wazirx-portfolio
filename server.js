// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const fetch = require('node-fetch');
// Declare a route
fastify.get('/', async (request, reply) => {
  fetch('')
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(8000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()