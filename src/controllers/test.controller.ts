import { Controller, Get } from "routing-controllers";

@Controller()
export class TestController {
  @Get("/users")
  getAll() {
    return "This is a user list";
  }
}