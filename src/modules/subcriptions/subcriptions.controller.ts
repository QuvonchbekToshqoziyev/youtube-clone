import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubcriptionsService } from './subcriptions.service';
import { CreateSubcriptionDto } from './dto/create-subcription.dto';
import { UpdateSubcriptionDto } from './dto/update-subcription.dto';

@Controller('subcriptions')
export class SubcriptionsController {
  constructor(private readonly subcriptionsService: SubcriptionsService) {}

  @Post()
  create(@Body() createSubcriptionDto: CreateSubcriptionDto) {
    return this.subcriptionsService.create(createSubcriptionDto);
  }

  @Get()
  findAll() {
    return this.subcriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcriptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubcriptionDto: UpdateSubcriptionDto) {
    return this.subcriptionsService.update(+id, updateSubcriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcriptionsService.remove(+id);
  }
}
