import { Task } from "src/tasks/task.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {

}