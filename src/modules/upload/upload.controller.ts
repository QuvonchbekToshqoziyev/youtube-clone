import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Res,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { posterFilePipe, videoFilePipe } from './filemax/pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('video/:videoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Video fayl yuklash', description: 'Access: Authenticated' })
  uploadVideo(
    @Param('videoId') videoId: string,
    @UploadedFile(videoFilePipe) file: Express.Multer.File,
  ) {
    return this.uploadService.saveVideoFile(videoId, file);
  }

  @Post('thumbnail/:videoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Video thumbnail yuklash', description: 'Access: Authenticated' })
  uploadThumbnail(
    @Param('videoId') videoId: string,
    @UploadedFile(posterFilePipe) file: Express.Multer.File,
  ) {
    return this.uploadService.saveThumbnail(videoId, file);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Profil avatarini yuklash', description: 'Access: Authenticated' })
  uploadAvatar(
    @Req() req: Request & { user: { id: string } },
    @UploadedFile(posterFilePipe) file: Express.Multer.File,
  ) {
    return this.uploadService.saveAvatar(req.user.id, file);
  }

  @Get('thumbnail/:videoId')
  @ApiOperation({ summary: 'Video thumbnailini olish', description: 'Access: PUBLIC' })
  async serveThumbnail(
    @Param('videoId') videoId: string,
    @Res() res: Response,
  ) {
    const filePath = await this.uploadService.getThumbnailPath(videoId);
    return res.sendFile(filePath);
  }

  @Get('video/:videoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Video faylini olish', description: 'Access: Authenticated' })
  async serveVideo(
    @Param('videoId') videoId: string,
    @Res() res: Response,
  ) {
    const { path, filename } = await this.uploadService.getVideoFilePath(videoId);
    return res.download(path, filename);
  }

  @Get('avatar/:userId')
  @ApiOperation({ summary: 'Foydalanuvchi avatarini olish', description: 'Access: PUBLIC' })
  async serveAvatar(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    const filePath = await this.uploadService.getAvatarPath(userId);
    return res.sendFile(filePath);
  }
}

