const Fastify = require('fastify')
const fastify = Fastify()

const PORT = 6000

fastify.get('/', (request, reply) => {
    return 'Hello World'
})

fastify.listen({ port: Number(PORT) }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server started on port ${PORT}`)
})