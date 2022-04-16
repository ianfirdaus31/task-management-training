import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
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
  
  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepo.getTasks(filterDto, user)
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: {
        id,
        user
      }
    })

    if (!task) {
      throw new NotFoundException()
    }

    return task
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepo.createTask(createTaskDto, user)
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user)
    task.status = status
    await this.taskRepo.save(task)

    return task
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const found = await this.taskRepo.delete({ id, user })

    if (found.affected === 0) {
      throw new NotFoundException
    }
    console.log(found)
  }
}
