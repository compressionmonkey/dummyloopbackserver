import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
    mongodb: {
      schema: 'test',
      table: 'users'
    }
  }
})
export class Users extends Entity {
  @property({
    type: 'any',
    id: true,
    generated: true,
  })
  _id?: any;

  @property({
    type: 'string',
    required: true,
  })
  fullName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  confirmed_password: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = Users & UserRelations;
