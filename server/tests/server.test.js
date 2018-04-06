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
    text: 'Second test todo V2',
    completed: true,
    completedAt: 123,
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

describe('DELETE /toods/:id', () => {
    it('should remove a todo', (done) => {
        const id = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(id).then((res) => {
                    expect(res).toBeNull();
                    done();
                }).catch(err => done(err));
            });
    });

    it('should return 404 if todo not found', (done) => {
        const someId = new ObjectID();
        request(app)
            .delete(`/todos/${someId.toHexString}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if non-object ids', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        const id = todos[0]._id.toHexString();
        const text = 'Some bullshit new text';
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text,
                completed: true,
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
        // my question is, sometimes we need to validate the res inside end block.
        // we do another query to the db, then validate the data.
        // sometimes we just validate them inside expect block. why?
    });

    it('should clear completedAt when todo is not completed', (done) => {
        const id = todos[1]._id.toHexString();
        const text = 'Some bullshit new text';
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text,
                completed: false,
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);
    });
});
