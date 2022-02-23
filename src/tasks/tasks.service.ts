import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks-filter-dto';
import { TaskStatus } from 'src/tasks/task-status.enum';
import { Task } from 'src/tasks/task.entity';
import { TasksRepository } from 'src/tasks/tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private taskRepo: TasksRepository
  ) {}
  
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepo.getTasks(filterDto)
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne(id)

    if (!task) {
      throw new NotFoundException()
    }

    return task
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepo.createTask(createTaskDto)
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id)
    task.status = status
    await this.taskRepo.save(task)

    return task
  }

  async deleteTask(id: string): Promise<void> {
    const found = await this.taskRepo.delete(id)

    if (found.affected === 0) {
      throw new NotFoundException
    }
    console.log(found)
  }
}
