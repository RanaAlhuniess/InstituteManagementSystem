import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  request,
  requestBody,
} from 'inversify-express-utils';
import { inject } from 'inversify';

@controller('/auth')
export class AuthController extends BaseHttpController {
  constructor() {
    super();
  }

  @httpPost('/register')
  register() {

    console.log('hi from register');
    return {
      test: "hi from register"
    }
  }
}
