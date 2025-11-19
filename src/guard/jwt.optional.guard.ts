import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtOptionalGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return true;
    }
    const token = authHeader.split(' ')[1];

    try {
      const decoded = await this.jwtTokenService.verifyAccessToken({ token });
      const user = await this.prismaService.users.findUnique({
        where: { id: decoded.userId },
      });
      req.user = user;
      return true;
    } catch (error) {
      throw error;
    }
  }
}
