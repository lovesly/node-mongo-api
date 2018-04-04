// expect package is donated to jest(wtf...)
// need to refactor the test with jest.
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
}];

// eslint-disable-next-line
beforeEach(function(done) {
    // I'm superised that insert 2 docs cost more than 2000ms
    // actually remove cost 1050ms, insert cost 1034ms.
    this.timeout(5000);
    const st1 = new Date().getTime();
    let st2;
    let st3;
    Todo.remove({}).then(() => {
        st2 = new Date().getTime();
        // console.log(st2 - st1);
        return Todo.insertMany(todos);
    }).then(() => {
        st3 = new Date().getTime();
        // console.log(st3 - st2);
        done();
    });
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test /todos api';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                // why do we put the test inside end block?
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(err => done(err));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        const someId = new ObjectID();
        request(app)
            .get(`/todos/${someId.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});
