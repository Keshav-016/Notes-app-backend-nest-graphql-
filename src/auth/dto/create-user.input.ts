import { Field, ArgsType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

@ArgsType()
export class CreateUserInput {
  @Field(() => String)
  @IsOptional()
  name?: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;
}
