import { User } from "src/auth/user.entity";
import { CreateTaskDto } from "src/tasks/dto/create-task.dto";
import { GetTasksFilterDto } from "src/tasks/dto/get-tasks-filter-dto";
import { TaskStatus } from "src/tasks/task-status.enum";
import { Task } from "src/tasks/task.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto
    const query = this.createQueryBuilder('task')
    query.where({ user })

    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` })
    }

    const tasks = await query.getMany()

    return tasks
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    })

    await this.save(task)

    return task
  }
}