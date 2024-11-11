import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { WinstonModule } from 'nest-winston';
import { ValidationModule } from './validation/validation.module';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({ 
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
      ],
      }),
    UserModule,
    PrismaModule,
    ValidationModule.forRoot(true),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
