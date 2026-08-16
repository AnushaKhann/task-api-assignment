const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');


describe('Task API', () => {

  beforeEach(() => {
    taskService._reset();
  });


  test('POST /tasks should create a task', async () => {

    const response = await request(app)
      .post('/tasks')
      .send({
        title: "Practice DSA",
        priority: "high"
      });


    expect(response.statusCode).toBe(201);

    expect(response.body.title)
      .toBe("Practice DSA");

    expect(response.body.priority)
      .toBe("high");

  });


  test('GET /tasks should return tasks', async () => {

    await taskService.create({
      title:"Learn Node"
    });


    const response = await request(app)
      .get('/tasks');


    expect(response.statusCode)
      .toBe(200);

    expect(response.body.length)
      .toBe(1);

  });


  test('POST /tasks should reject empty title', async()=>{

    const response = await request(app)
      .post('/tasks')
      .send({
        title:""
      });


    expect(response.statusCode)
      .toBe(400);

  });

test('PATCH /tasks/:id/assign should assign a task', async () => {

  const task = await taskService.create({
    title: "Prepare Mantra Care"
  });


  const response = await request(app)
    .patch(`/tasks/${task.id}/assign`)
    .send({
      assignee: "Anusha"
    });


  expect(response.statusCode).toBe(200);

  expect(response.body.assignee)
    .toBe("Anusha");

});


test('PATCH /tasks/:id/assign should reject empty assignee', async () => {

  const task = await taskService.create({
    title:"Testing"
  });


  const response = await request(app)
    .patch(`/tasks/${task.id}/assign`)
    .send({
      assignee:""
    });


  expect(response.statusCode)
    .toBe(400);

});


test('PATCH /tasks/:id/assign should return 404 for missing task', async()=>{

  const response = await request(app)
    .patch('/tasks/random-id/assign')
    .send({
      assignee:"Anusha"
    });


  expect(response.statusCode)
    .toBe(404);

});

test('PUT /tasks/:id should update task', async()=>{

  const task = await taskService.create({
    title:"Old title"
  });


  const response =
    await request(app)
    .put(`/tasks/${task.id}`)
    .send({
      title:"New title"
    });


  expect(response.statusCode)
    .toBe(200);

  expect(response.body.title)
    .toBe("New title");

});

test('PUT /tasks/:id should return 404 if task missing', async()=>{

  const response =
    await request(app)
    .put('/tasks/random-id')
    .send({
      title:"Update"
    });


  expect(response.statusCode)
    .toBe(404);

});

test('DELETE /tasks/:id should delete task', async()=>{

  const task = await taskService.create({
    title:"Delete me"
  });


  const response =
    await request(app)
    .delete(`/tasks/${task.id}`);


  expect(response.statusCode)
    .toBe(204);

});

test('PATCH /tasks/:id/complete should complete task', async()=>{

  const task = await taskService.create({
    title:"Complete me"
  });


  const response =
    await request(app)
    .patch(`/tasks/${task.id}/complete`);


  expect(response.statusCode)
    .toBe(200);


  expect(response.body.status)
    .toBe("done");

});

test('GET /tasks/stats should return task statistics', async()=>{

  await taskService.create({
    title:"Task 1",
    status:"todo"
  });

  await taskService.create({
    title:"Task 2",
    status:"done"
  });


  const response =
    await request(app)
    .get('/tasks/stats');


  expect(response.statusCode)
    .toBe(200);


  expect(response.body.todo)
    .toBe(1);


  expect(response.body.done)
    .toBe(1);

});

test('DELETE missing task should return 404', async()=>{

 const response =
 await request(app)
 .delete('/tasks/random-id');


 expect(response.statusCode)
 .toBe(404);

});

test('PATCH assign should reject missing assignee', async()=>{

 const task =
 await taskService.create({
   title:"Testing"
 });


 const response =
 await request(app)
 .patch(`/tasks/${task.id}/assign`)
 .send({});


 expect(response.statusCode)
 .toBe(400);

});

test('POST should reject invalid priority', async()=>{

 const response =
 await request(app)
 .post('/tasks')
 .send({
   title:"Test",
   priority:"urgent"
 });


 expect(response.statusCode)
 .toBe(400);

});

});