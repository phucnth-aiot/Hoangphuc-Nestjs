import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { extname } from 'path';
import { promises as fs } from 'fs';
import { Express } from 'express';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  async findAll(filterDto: FilterTaskDto) {
    const { status, title, page = '1', limit = '10' } = filterDto;

    const where: Partial<Record<keyof Task, any>> = {};
    if (status) where.status = status;
    if (title) where.title = Like(`%${title}%`);

    const [data, total] = await this.taskRepository.findAndCount({
      where,
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
      },
    };
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async uploadFile(taskId: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded!');
    }

    if (!file.buffer) {
      throw new BadRequestException('File buffer is empty!');
    }

    const allowedExt = ['.jpg', '.jpeg', '.png', '.pdf'];
    const fileExt = extname(file.originalname).toLowerCase();

    if (!allowedExt.includes(fileExt)) {
      throw new BadRequestException('Invalid file type!');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB!');
    }

    const newName = `task-${taskId}-${Date.now()}${fileExt}`;

    await fs.mkdir('./uploads', { recursive: true });
    await fs.writeFile(`./uploads/${newName}`, file.buffer);

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Task id ${taskId} not found`);

    task.fileUrl = newName;
    await this.taskRepository.save(task);

    return {
      message: 'Upload successful!',
      filename: newName,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
