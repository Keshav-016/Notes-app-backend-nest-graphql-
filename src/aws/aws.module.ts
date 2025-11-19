import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AwsService, ConfigService],
  exports: [AwsService],
})
export class AwsModule {}
