import { Visibility } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateVideoDto {
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsString()
	authorId: string;

	@IsOptional()
	@IsString()
	videoUrl?: string;

	@IsOptional()
	@IsInt()
	@Min(0)
	duration?: number;

	@IsOptional()
	@IsEnum(Visibility)
	visibility?: Visibility;
}
