import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { VideosModule } from './modules/videos/videos.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LikesModule } from './modules/likes/likes.module';
import { UsersModule } from './modules/users/users.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { SubcriptionsModule } from './modules/subcriptions/subcriptions.module';

@Module({
  imports: [PrismaModule, AuthModule, VideosModule, CommentsModule, LikesModule, UsersModule, PlaylistsModule, SubcriptionsModule],
})
export class AppModule {}
