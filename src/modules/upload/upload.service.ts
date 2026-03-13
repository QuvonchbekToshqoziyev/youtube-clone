import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  async saveVideoFile(videoId: string, file: Express.Multer.File) {
    const video = await this.prisma.video.findUnique({ where: { id: videoId } });
    if (!video) throw new NotFoundException('Video topilmadi');

    const videoUrl = `/uploads/videos/${file.filename}`;
    await this.prisma.video.update({ where: { id: videoId }, data: { videoUrl } });

    return { success: true, message: 'Video fayl yuklandi', data: { videoUrl } };
  }

  async saveThumbnail(videoId: string, file: Express.Multer.File) {
    const video = await this.prisma.video.findUnique({ where: { id: videoId } });
    if (!video) throw new NotFoundException('Video topilmadi');

    const thumbnail = `/uploads/thumbnails/${file.filename}`;
    await this.prisma.video.update({ where: { id: videoId }, data: { thumbnail } });

    return { success: true, message: 'Thumbnail yuklandi', data: { thumbnail } };
  }

  async getThumbnailPath(videoId: string): Promise<string> {
    const video = await this.prisma.video.findUnique({ where: { id: videoId } });
    if (!video || !video.thumbnail) throw new NotFoundException('Thumbnail topilmadi');

    const relativePath = video.thumbnail.replace(/^\//, '');
    const fullPath = join(process.cwd(), relativePath);
    if (!existsSync(fullPath)) throw new NotFoundException('Thumbnail fayli topilmadi');
    return fullPath;
  }

  async getVideoFilePath(videoId: string): Promise<{ path: string; filename: string }> {
    const video = await this.prisma.video.findUnique({ where: { id: videoId } });
    if (!video || !video.videoUrl) throw new NotFoundException('Video fayli topilmadi');

    const relativePath = video.videoUrl.replace(/^\//, '');
    const fullPath = join(process.cwd(), relativePath);
    if (!existsSync(fullPath)) throw new NotFoundException('Video fayli diskda topilmadi');
    return { path: fullPath, filename: `${video.title}.mp4` };
  }

  async saveAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const avatar = `/uploads/avatars/${file.filename}`;
    await this.prisma.user.update({ where: { id: userId }, data: { avatar } });
    return { success: true, message: 'Avatar yuklandi', data: { avatar } };
  }

  async getAvatarPath(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.avatar) throw new NotFoundException('Avatar topilmadi');

    const relativePath = user.avatar.replace(/^\//, '');
    const fullPath = join(process.cwd(), relativePath);
    if (!existsSync(fullPath)) throw new NotFoundException('Avatar fayli topilmadi');
    return fullPath;
  }
}

