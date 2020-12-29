import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class UserDto extends Model {
  @property({
    type: 'any',
    id: true,
    generated: false,
  })
  _id?: any;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserDto>) {
    super(data);
  }
}

export interface UserDtoRelations {
  // describe navigational properties here
}

export type UserDtoWithRelations = UserDto & UserDtoRelations;
