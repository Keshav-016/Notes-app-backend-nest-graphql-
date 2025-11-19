import { Injectable } from '@nestjs/common';
import { GraphQLUpload } from 'graphql-upload';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserInput } from './dto/login-user.input';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import CustomError from 'src/filters/custom-error-filter';
import { StatusCodes } from 'src/enum/status-codes.enum';
import { AwsService } from 'src/aws/aws.service';
import { User } from './models/login-user-model';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly awsService: AwsService,
  ) {}
  async registerUser(input: CreateUserInput) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { email: input.email },
      });
      if (user) {
        throw new CustomError(StatusCodes.CONFLICT, 'User already exists');
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(input.password, salt);
      const newUser = await this.prismaService.users.create({
        data: {
          ...input,
          password: hashedPassword,
          name: input?.name || 'user',
        },
      });
      const token = await this.jwtTokenService.generateAccessToken({
        userId: newUser.id,
      });
      return {
        success: true,
        message: 'User created successfully',
        data: { token: token, user: newUser.name },
      };
    } catch (error) {
      throw error;
    }
  }

  async loginUser(input: LoginUserInput, user?: User) {
    try {
      if (!user) {
        const checkUser = await this.prismaService.users.findUnique({
          where: { email: input.email },
        });

        if (!checkUser) {
          throw new CustomError(StatusCodes.NOT_FOUND, 'User not found');
        }

        const isMatch = await bcrypt.compare(
          input.password,
          checkUser.password,
        );
        if (!isMatch) {
          throw new CustomError(StatusCodes.UNAUTHORIZED, 'Invalid password');
        }

        user = {
          id: checkUser.id,
          name: checkUser.name,
          imageUrl: checkUser.imageUrl,
        };
      }

      if (user.imageUrl) {
        const url = await this.awsService.fetchSignedUrl(user.imageUrl);
        user = { ...user, imageUrl: url };
      }

      const token = await this.jwtTokenService.generateAccessToken({
        userId: user.id,
      });

      return {
        data: { token: token, user: user },
        message: 'Logged in successfully',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async uploadProfileImage(file: GraphQLUpload, user: User) {
    try {
      if (user.imageUrl) {
        await this.awsService.deletefile(user.imageUrl);
      }
      const url = await this.awsService.uploadFile(file);
      await this.prismaService.users.update({
        data: { imageUrl: url },
        where: { id: user.id },
      });
      return {
        message: 'Image uploaded successfully',
        success: true,
        data: url,
      };
    } catch (error) {
      throw error;
    }
  }
}
