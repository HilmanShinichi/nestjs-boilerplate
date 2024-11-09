import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import * as httpMocks from 'node-mocks-http';
import { UserService } from './user.service';
describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  test('should can say hello', async () => {
    const response = await controller.sayHello('hilman', 'septiana');
    expect(response).toBe('Hello hilman septiana');
  });

  test('should can view template', async () => {
    const response = httpMocks.createResponse();
    controller.viewHello('hilman', response);

    expect(response._getRenderView()).toBe('index.html');
    expect(response._getRenderData()).toEqual({
      name: 'hilman',
      title: 'Template Engine',
    });
  });
});
