import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './domain/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './domain/auth/auth.module';
import { typeOrmConfig } from './config/database.config';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ 
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
