import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';
import { AuthResolver } from './auth.resolver';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [JwtTokenModule, AwsModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
