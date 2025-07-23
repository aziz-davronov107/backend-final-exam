import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateMentorDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateMentorDto, ['password'] as const),
) {}
