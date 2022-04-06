import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TasksModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ifpostgres.cjmmccibo7cf.ap-southeast-1.rds.amazonaws.com',
      port: 5432,
      username: 'postgres',
      password: '12345678',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true
    }), AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
