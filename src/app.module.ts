import { UserController } from './controllers/user.controller';
import {TestController} from './controllers/test.controller';

export class AppModule {
  
  // Static array grouping all domain controllers together
  static readonly controllers = [
    UserController,
    TestController
  ];
}