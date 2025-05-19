import { IsString, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @MinLength(5)
  question: string;
}
