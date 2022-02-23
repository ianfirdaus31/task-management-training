import { CreateTaskDto } from "src/tasks/dto/create-task.dto";
import { GetTasksFilterDto } from "src/tasks/dto/get-tasks-filter-dto";
import { TaskStatus } from "src/tasks/task-status.enum";
import { Task } from "src/tasks/task.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto
    const query = this.createQueryBuilder('task')

    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` })
    }

    const tasks = await query.getMany()

    return tasks
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    })

    await this.save(task)

    return task
  }
}