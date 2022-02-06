import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from 'src/tasks/tasks.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = []

  getAllTasks(): Task[] {
    return this.tasks
  }

  createTask(title: string, description: string): Task {
    const task: Task = {
      id: uuid(),
      status: TaskStatus.DONE,
      title,
      description
    }

    this.tasks.push(task)
    return task
  }
}
