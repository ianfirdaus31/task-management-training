import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks-filter-dto';
import { UpdateTaskStatusDto } from 'src/tasks/dto/update-task.dto';
import { TaskStatus } from 'src/tasks/task-status.enum';
import { Task } from 'src/tasks/task.entity';
import { TasksService } from 'src/tasks/tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user)
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user)
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user)
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string, 
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User
  ): Promise<Task> {
    const { status } = updateTaskStatusDto
    
    return this.tasksService.updateTask(id, status, user)
  }

  @Delete('/:id')
  deleteTask(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user)
  }
}
