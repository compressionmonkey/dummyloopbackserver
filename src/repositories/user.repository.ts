import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbconnectionDataSource} from '../datasources';
import {UserRelations, Users} from '../models';

export class UserRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype._id,
  UserRelations
  > {
  constructor(
    @inject('datasources.mongodbconnection') dataSource: MongodbconnectionDataSource,
  ) {
    super(Users, dataSource);
  }
}
