import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND
} from '@loopback/authentication';
import {
  Context
} from '@loopback/context';
import {inject} from '@loopback/core';
// import {MiddlewareSequence} from '@loopback/rest';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject, RequestContext,
  RestBindings,
  Send,
  SequenceActions,
  SequenceHandler
} from '@loopback/rest';

// export class MySequence extends MiddlewareSequence { }
export class MySequence implements SequenceHandler {
  constructor(
    @inject(RestBindings.Http.CONTEXT) public ctx: Context,
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn
  ) { }
  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const route = this.findRoute(request);
      console.log('jau', route)
      await this.authenticateRequest(request);
      const args = await this.parseParams(request, route);
      console.log('kel', args, response, await this.invoke(route, args))
      const result = await this.invoke(route, args);
      console.log('pop', result, response)
      this.send(response, result);
      console.log('done1')
    }
    catch (err) {
      console.log('may', err.code)
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401});
      }
      this.reject(context, err)
      console.log('done2')
    }
  }
}
