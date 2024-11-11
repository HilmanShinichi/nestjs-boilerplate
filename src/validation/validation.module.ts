import { DynamicModule, Module } from '@nestjs/common';
import { ValidationService } from './validation/validation.service';

@Module({})
export class ValidationModule {
  static forRoot(isGlobal: boolean = false): DynamicModule {
    return {
      global: isGlobal,
      module: ValidationModule,
      providers: [ValidationService],
      exports: [ValidationService],
    };
  }
}
