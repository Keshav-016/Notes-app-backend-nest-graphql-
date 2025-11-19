import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
class NoteInput {
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(5, { message: 'Description must be at least 5 characters long' })
  description: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Boolean, { nullable: true })
  isImportant?: boolean;
}

@ArgsType()
export class CreateNoteInput {
  @Field(() => [NoteInput])
  notes: NoteInput[];
}
