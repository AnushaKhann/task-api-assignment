const taskService = require('../src/services/taskService');

describe('Task Service', () => {

  beforeEach(() => {
    taskService._reset();
  });


  test('should create a task', () => {

    const task = taskService.create({
      title: "Practice DSA"
    });

    expect(task.title).toBe("Practice DSA");
    expect(task.status).toBe("todo");

  });


  test('should find task by id', () => {

    const created = taskService.create({
      title:"Learn Node"
    });

    const task = taskService.findById(created.id);

    expect(task.id).toBe(created.id);

  });


  test('should update task', () => {

    const created = taskService.create({
      title:"Learn Express"
    });


    const updated = taskService.update(
      created.id,
      {
        priority:"high"
      }
    );


    expect(updated.priority)
      .toBe("high");

  });


  test('should delete task',()=>{

    const created = taskService.create({
      title:"Delete me"
    });


    const result =
      taskService.remove(created.id);


    expect(result).toBe(true);

  });

  test('should return undefined for missing task', () => {

    const task = taskService.findById("wrong-id");

    expect(task).toBeUndefined();

  });

  test('should filter tasks by status', () => {

    taskService.create({
        title: "Completed task",
        status: "done"
    });

    taskService.create({
        title: "Todo task",
        status: "todo"
    });


    const result = taskService.getByStatus("done");


    expect(result.length).toBe(1);
    expect(result[0].status).toBe("done");

  });

  test('should handle invalid pagination values', () => {

    for(let i = 0; i < 5; i++){
        taskService.create({
        title:`Task ${i}`
        });
    }

    const result =
        taskService.getPaginated(0,10);


    expect(result.length).toBe(5);

  });

  test('should complete a task', () => {

    const task = taskService.create({
        title:"Finish assignment"
    });


    const updated =
        taskService.completeTask(task.id);


    expect(updated.status)
        .toBe("done");

    expect(updated.completedAt)
        .not.toBeNull();

  });

});