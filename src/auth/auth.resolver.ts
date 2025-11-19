import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserModel, uploadImage, User } from './models/login-user-model';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtOptionalGuard } from 'src/guard/jwt.optional.guard';
import { GraphQLUpload } from 'graphql-upload';
import { JwtGuard } from 'src/guard/jwt.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginUserModel)
  registerUser(@Args() input: CreateUserInput) {
    return this.authService.registerUser(input);
  }

  @Query(() => LoginUserModel)
  @UseGuards(JwtOptionalGuard)
  loginUser(@Args() input: LoginUserInput, @GetUser() user: User) {
    return this.authService.loginUser(input, user);
  }

  @Mutation(() => uploadImage)
  @UseGuards(JwtGuard)
  uploadImage(
    @Args('file', { type: () => GraphQLUpload }) file: GraphQLUpload,
    @GetUser() user: User,
  ) {
    console.log(user);
    return this.authService.uploadProfileImage(file, user);
  }
}
