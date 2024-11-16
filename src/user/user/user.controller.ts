import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Header,
  HttpCode,
  HttpRedirectResponse,
  Redirect,
  Res,
  Req,
  Inject,
  UseFilters,
  HttpException,
  ParseIntPipe,
  Body,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from '@prisma/client';
import { ValidationFilter } from 'src/validation/validation.filter';
import { request } from 'http';
import { LoginUserRequest, loginUserRequestValidation } from 'src/model/login.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { TimeInterceptor } from 'src/time/time.interceptor';

@Controller('/api/users')
export class UserController {
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepository: UserRepository,
    private memberService: MemberService,
  ) {}

  @UsePipes(new ValidationPipe(loginUserRequestValidation))
  //@UseFilters(ValidationFilter)
  @Post('/login')
  @UseInterceptors(TimeInterceptor)
  login(@Body() request: LoginUserRequest) {
    return {
      data : `Hello ${request.username}`,
    }
  }

  @Get('/connection')
  async getConnection(): Promise<string> {
    this.mailService.send();
    this.emailService.send();
    console.info(this.memberService.getConnectionName());
    this.memberService.sendEmail();
    return this.connection.getName();
  }

  @Get('/create')
  async create(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
  ): Promise<User> {
    if (!firstName) {
      throw new HttpException(
        {
          status: 400,
          error: 'firstName is required',
        },
        400,
      );
    }
    return this.userRepository.save(firstName, lastName);
  }

  @Get('/hello')
  //@UseFilters(ValidationFilter)
  async sayHello(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
  ): Promise<string> {
    return this.service.sayHello(firstName, lastName);
  }

  @Get('/view/hello')
  viewHello(@Query('name') name: string, @Res() response: Response) {
    response.render('index.html', {
      title: 'Template Engine',
      name: name,
    });
  }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send('Success Set Cookie');
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request): string {
    return request.cookies['name'];
  }

  @Post()
  post(): string {
    return 'INI POST';
  }

  @Get('/sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  sampleResponse(): Record<string, string> {
    return {
      data: 'Hello JSON',
    };
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/sample-response',
      statusCode: 301,
    };
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): string {
    console.log(id + 10);
    return `GET ${id}`;
  }

  @Get('/sample')
  get(): string {
    return 'GET SAMPLE';
  }
}
