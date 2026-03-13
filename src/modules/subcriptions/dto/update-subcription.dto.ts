import { PartialType } from '@nestjs/swagger';
import { CreateSubcriptionDto } from './create-subcription.dto';

export class UpdateSubcriptionDto extends PartialType(CreateSubcriptionDto) {}
