const xapi = {
  agent: new TinCan.Agent({
    account: {
      name: 'Anonymous',
      homePage: 'http://www.xapicohort.com'
    }
  }),

  root: 'http://www.xapicohort.com/xapi/activities/makerspace/ar',

  init() {
    this.lrs = new TinCan.LRS(this.config);
    console.log(this.lrs);
  },

  config: {
    endpoint: 'https://content.learnshare.com/xapi/api/',
    auth: ''
  },

  createAgent(email) {
    const agent = new TinCan.Agent({
      account: {
        name: email,
        homePage: 'http://www.xapicohort.com'
      }
    });

    xapi.agent = agent;
    return agent;
  },

  state: {

  },

  statement: {
    send(verb, markerId) {
      const stmt = {
        verb: new TinCan.Verb({
          id: xapi.verbs[verb],
          display: {
            'en-US': verb
          }
        }),

        object: new TinCan.Activity({
          id: xapi.root + '/' + markerId,
          definition: {
            name: {
              'en-US': markerId
            }
          }
        })
      };

      stmt.actor = xapi.agent;

      var tcStatement = new TinCan.Statement(stmt);

      console.log('tcStatement:', tcStatement);

      xapi.lrs.saveStatement(tcStatement, {
        callback(err, xhr) {
          console.log(err, xhr);
        }
      });

    }
  },

  markers: {
    'watering-can': {
      el: 'watering-can'
    },

    plant1: {
      el: 'plant1'
    },

    plant3: {
      el: 'plant3'
    },

    'plant-aloe': {
      el: 'plant-aloe'
    }
  },

  verbs: {
    located: 'https://w3id.org/xapi/dod-isd/verbs/located',
    tested: 'https://w3id.org/xapi/dod-isd/verbs/tested',

  }
}