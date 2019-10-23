import { UserInterface } from './components/UserInterface';
import { UserInput } from './components/UserInput';
import { ResultsFormatter } from './components/ResultsFormatter';

const {
  Stitch,
  RemoteMongoClient,
  UserApiKeyCredential
} = require('mongodb-stitch-browser-sdk');

export class StitchController {
  constructor() {
    this.db = {}; // initialize database object
    this.sc = {}; // initialize service client object
  }

  async init() {
    try {
      this.initClientForAppId(process.env.REACT_APP_STITCH_APP_ID);                 // initializes the client
      await this.loginUsingApiKey(process.env.REACT_APP_STITCH_API_SECRET); // authorizes the client for use
      const mongodb = await this.initServiceClient(process.env.REACT_APP_STITCH_SERVICE_NAME); // initializes MongoDB service client (for database access)
      await this.initDBFromServiceClient('test', mongodb); // initializes test db for access
      return 0;
    }
    catch(err) {
      console.log(err);
      return err;
    }
  }

  // returns client 
  initClientForAppId(appId) {
    this.client = Stitch.initializeDefaultAppClient(appId);
  }

  // returns a Promise (of user info)
  loginUsingApiKey(key) {
    const credential = new UserApiKeyCredential(process.env.REACT_APP_STITCH_API_SECRET);
    return this.client.auth.loginWithCredential(credential)
      .then(user => {
        console.log(`Logged into Stitch client as API user (server) with id: ${user.id}`);
        return user;
      })
      .catch(err => {
        console.error(err);
        return err;
      });
  }

  // returns a Promise (of service client)
  async initServiceClient(name) {
    this.sc[name] = await this.client.getServiceClient(
      RemoteMongoClient.factory,
      name
    );

    return this.sc[name];
  }

  // returns Promise (of db client)
  async initDBFromServiceClient(name, sc) {
    this.db[name] = await sc.db(name);

    return this.db[name];
  }

  callFunction(name, args) {
    return this.client.callFunction(name, args)
      .catch(err => {
        console.error(err);
        return err;
      });
  }
};


export const StitchComponents = {
  UserInterface,
  UserInput,
  ResultsFormatter
};
