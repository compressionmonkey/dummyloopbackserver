import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
require('dotenv').config()

const config = {
  name: 'mongodbconnection',
  connector: 'mongodb',
  url: process.env.URL,
  host: 'STS-1300',
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongodbconnectionDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongodbconnection';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongodbconnection', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
