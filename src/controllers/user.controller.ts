import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials, MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  get, getModelSchemaRef, post,

  requestBody
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {Users} from '../models';

const CredentialsRequestBody = {
  description: 'Input of login function',
  required: true,
  content: {
    'application/json': {schema: Users}
  }
}

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE) public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true}) public user: UserProfile,
    @repository(UserServiceBindings.USER_REPOSITORY) protected userRepository: UserRepository,
  ) { }
  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody(CredentialsRequestBody) creditionals: Credentials
  ): Promise<{token: string}> {
    console.log('hekkkkk')
    const user = await this.userService.verifyCredentials(creditionals);
    console.log('kayyy', user)
    const userProfile = this.userService.convertToUserProfile(user);

    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/whoami', {
    responses: {
      '200': {
        description: '',
        schema: {
          type: 'string'
        }
      }
    }
  })

  async whoAmI(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile
  ): Promise<string> {
    console.log('here')
    return currentUserProfile[securityId];
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User
            }
          }
        }
      }
    }
  })

  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUser'
          })
        }
      }
    })
    newUserRequest: Users
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password')
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }
}
