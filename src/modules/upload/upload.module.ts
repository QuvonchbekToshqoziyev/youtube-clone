import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { AuthModule } from '../auth/auth.module';

const UPLOAD_ROOT = join(process.cwd(), 'uploads');
const VIDEO_DIR = join(UPLOAD_ROOT, 'videos');
const THUMBNAIL_DIR = join(UPLOAD_ROOT, 'thumbnails');
const AVATAR_DIR = join(UPLOAD_ROOT, 'avatars');

[UPLOAD_ROOT, VIDEO_DIR, THUMBNAIL_DIR, AVATAR_DIR].forEach((dir) => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (_req, file, cb) => {
          const isVideo = file.mimetype.startsWith('video/');
          const dest = isVideo ? VIDEO_DIR : THUMBNAIL_DIR;
          cb(null, dest);
        },
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 4 * 1024 * 1024 * 1024 },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
