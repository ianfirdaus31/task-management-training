import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TasksRepository } from 'src/tasks/tasks.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  imports: [
    TypeOrmModule.forFeature([TasksRepository]),
    AuthModule
  ],
  providers: [TasksService]
})
export class TasksModule {}
