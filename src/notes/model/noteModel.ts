import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Response {
  @Field()
  message: string;

  @Field()
  success: boolean;
}

@ObjectType()
export class Note {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Boolean)
  isImportant: boolean;

  @Field(() => String)
  userId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class AllNotes extends Response {
  @Field(() => [Note])
  data: Note[];
}
