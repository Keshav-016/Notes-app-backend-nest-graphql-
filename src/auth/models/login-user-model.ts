import { ObjectType, Field } from '@nestjs/graphql';
import { Response } from 'src/notes/model/noteModel';

@ObjectType()
export class User {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field(() => String, { nullable: true })
  imageUrl?: string;
}

@ObjectType()
class LoginData {
  @Field()
  token: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class LoginUserModel extends Response {
  @Field(() => LoginData, { nullable: true })
  data: LoginData;
}

@ObjectType()
export class uploadImage extends Response {
  @Field()
  data: string;
}

@ObjectType()
export class fetchSignedUrl extends Response {
  @Field()
  data: string;
}
