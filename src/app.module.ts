import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { NotesModule } from './notes/notes.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from './auth/auth.module';
import { JwtTokenModule } from './jwt-token/jwt-token.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerServiceInterceptor } from './logger/logger.service';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
      autoSchemaFile: 'schema.gql',
      playground: false,
      csrfPrevention: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    PrismaModule,
    NotesModule,
    AuthModule,
    JwtTokenModule,
    AwsModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggerServiceInterceptor }],
})
export class AppModule {}
