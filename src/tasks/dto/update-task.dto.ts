import { IsEnum } from "class-validator";
import { TaskStatus } from "src/tasks/tasks.model";

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus
}