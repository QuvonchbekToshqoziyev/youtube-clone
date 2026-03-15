import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma:PrismaService){}
 async create(createCommentDto: CreateCommentDto,id:string) {
    const findVideo = await this.prisma.video.findUnique({where:{id}})
    if(!findVideo){
      throw new NotFoundException("Video mavjud emas Comment yozolmaysiz")
    }

    return await this.prisma.comment.create({
      data:createCommentDto
    })
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
