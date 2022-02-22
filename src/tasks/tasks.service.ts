import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks-filter-dto';
import { Task, TaskStatus } from 'src/tasks/task.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = []

  getAllTasks(): Task[] {
    return this.tasks
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto

    let tasks = this.getAllTasks()

    if (status) {
      tasks = tasks.filter(task => task.status === status)
    }

    if (search) {
      tasks = tasks.filter(task => {
        if (task.title.toLocaleLowerCase().includes(search) || task.description.toLocaleLowerCase().includes(search)) {
          return true
        }

        return false
      })
    }

    return tasks
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id)

    if (!task) {
      throw new NotFoundException()
    }

    return task
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto
    
    const task: Task = {
      id: uuid(),
      status: TaskStatus.DONE,
      title,
      description
    }

    this.tasks.push(task)
    return task
  }

  updateTask(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id)
    task.status = status
    return task
  }

  deleteTask(id: string): void {
    const found = this.getTaskById(id)
    this.tasks = this.tasks.filter(task => task.id !== found.id)
  }
}
