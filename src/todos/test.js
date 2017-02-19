const app = require('../src')
const request = require('supertest')
// const request = require('supertest-as-promised')
const { Todo } = require('./model')
const { todos } = require('../../lib/seed')

describe('STORMTROOPER TESTS SUITE', () => {
  describe('POST /todos', () => {
    beforeEach((done) => {
      Todo
        .remove({})
        .then(() => {
          return Todo
            .insertMany(todos)
            .then(() => done())
        })
        .catch(err => done(err))
    })

    test('should create a new todo', async () => {
      let text = 'Something to do'
      let { status, body } = await request(app)
        .post('/todos')
        .send({ text })

      expect(status).toBe(200)
      expect(typeof body).toBe('object')
      expect(body.text).toBe(text)
    })

    test('should not create todo with invalid data', async () => {
      let { status, body } = await request(app)
        .post('/todos')
        .send({})

      expect(status).toBe(400)
      expect(typeof body).toBe('object')
      expect(Object.keys(body)).toContain('errors')
      expect(body.errors).not.toBeUndefined()
    })
  })

  describe('GET /todos', () => {
    test('should get all todos', async () => {
      let { status, body } = await request(app)
          .get('/todos')

      expect(status).toBe(200)
      expect(typeof body).toBe('object')
      expect(body.todos.length).toBe(9)
    })
  })
})
