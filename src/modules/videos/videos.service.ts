import { Injectable, NotFoundException } from '@nestjs/common';
import { VideoStatus } from '@prisma/client';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createVideoDto: CreateVideoDto) {
    return this.prisma.video.create({
      data: {
        title: createVideoDto.title,
        description: createVideoDto.description,
        authorId: createVideoDto.authorId,
        videoUrl: createVideoDto.videoUrl ?? '',
        duration: createVideoDto.duration ?? 0,
        visibility: createVideoDto.visibility,
      },
      include: { author: { select: { id: true, username: true } } },
    });
  }

  findAll() {
    return this.prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, username: true } } },
    });
  }

  async findOne(id: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: { author: { select: { id: true, username: true } } },
    });
    if (!video) throw new NotFoundException('Video topilmadi');
    return video;
  }

  async update(id: string, updateVideoDto: UpdateVideoDto) {
    await this.findOne(id);
    return this.prisma.video.update({
      where: { id },
      data: updateVideoDto,
      include: { author: { select: { id: true, username: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.video.delete({ where: { id } });
  }

  upload(
    file: Express.Multer.File,
    payload: { title: string; description?: string; authorId: string },
  ) {
    return this.prisma.video.create({
      data: {
        title: payload.title,
        description: payload.description,
        authorId: payload.authorId,
        videoUrl: `/uploads/videos/${file.filename}`,
        duration: 0,
        status: VideoStatus.PROCESSING,
      },
      include: { author: { select: { id: true, username: true } } },
    });
  }
}
