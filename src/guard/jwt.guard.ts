import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { StatusCodes } from 'src/enum/status-codes.enum';
import CustomError from 'src/filters/custom-error-filter';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }
    const token = authHeader.split(' ')[1];

    try {
      const decoded = await this.jwtTokenService.verifyAccessToken({ token });
      const user = await this.prismaService.users.findUnique({
        where: { id: decoded.userId },
      });
      req.user = { id: user.id, name: user.name, imageUrl: user.imageUrl };
      return true;
    } catch (error) {
      throw error;
    }
  }
}
