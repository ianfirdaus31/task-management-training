import { Test } from '@nestjs/testing'
import { TasksRepository } from './tasks.repository'
import { TasksService } from './tasks.service'
import { TaskStatus } from './task-status.enum'
import { NotFoundException } from '@nestjs/common/exceptions'

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn()
})

const mockUser = {
  username: 'Testuser',
  id: 'someId',
  password: '123456',
  tasks: []
}

describe('TasksService', () => {
  let tasksService: TasksService
  let taskRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository
        }
      ]
    }).compile()

    tasksService = module.get(TasksService)
    taskRepository = module.get(TasksRepository)
  })

  describe('getAllTasks', () => {
    it('calls TaskRepository.getTasks and return the result', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue')
      const result = await tasksService.getTasks(null, mockUser)
      expect(result).toEqual('someValue')
    })
  })

  describe('getTaskById', () => {
    it('calls TaskRepository.findOne and return the result', async () => {
      const mockTask = {
        id: 'someId',
        title: 'Test task', 
        description: 'Test desc',
        status: TaskStatus.OPEN
      }

      taskRepository.findOne.mockResolvedValue(mockTask)
      const result = await tasksService.getTaskById('someId', mockUser)

      expect(result).toEqual(mockTask)
    })

    it('calls TaskRepository.findOne and handles an error', async () => {
      taskRepository.findOne.mockResolvedValue(null)
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(NotFoundException)
    })
  })
})