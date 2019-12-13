var app = {
  init: function() {
    this.setAuth();
    this.xapi.init();
    this.bindEvents();
  },
  
  //recordSet: [],
  
  setAuth: function() {
    app.auth = {
      username: 'tools@torrancelearning.com',
      password: 'xapi-party'
    };
    
    app.lrs = {
      endpoint: 'https://cloud.scorm.com/tc/8UD9BTK3FA/sandbox/',
      auth: 'Basic ' + btoa("8UD9BTK3FA:dnUZlGymwVdrAlfcno0Hq1tvXeWj7meGEeG4gtEB"),
      username: '8UD9BTK3FA',
      password: 'dnUZlGymwVdrAlfcno0Hq1tvXeWj7meGEeG4gtEB',
      allowFail: false
    }
  },
  
  bindEvents: function() {
    $('#js-get-poll-results').on('click', function() {
      var url = $('#pe-url').val();
      console.log(url);
      var pollData = app.poll.parseURL(url);
    });
  },
  
  poll: {
    parseURL: function(url) {
      var splitUrl = url.split('/');
      var requestType = 'poll';
      
      // https://www.polleverywhere.com/surveys/t6wMMV1YEJhoqFqgsqNvR
      if (splitUrl.indexOf('surveys') == (splitUrl.length - 2)) {
          requestType = 'survey';
          app.poll.request.surveys(url);
      } else {
        // individual poll?
        // https://www.polleverywhere.com/polls/iuE0oZSdbAmsJDvSw8YUm/results
        var pollId = splitUrl[splitUrl.length -2];
      }
      
      console.log(requestType);
      
      
      return '';
    },
    
    request: {
      surveys: function(url) {
        app.grabSurveyJSON(url);
      } 
    }
  },
  
  api: {
    root: 'https://www.polleverywhere.com',
    headers: {'Content-Type':'application/json',
              'Accept':'application/json',
              // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
              'Authorization': 'Basic dG9vbHNAdG9ycmFuY2VsZWFybmluZy5jb206eGFwaS1wYXJ0eQ==',
              // 'Access-Control-Allow-Origin': '*',
              // 'Vary': 'Origin'
             }
  },
  /**
  * Grabs results for each poll, returns them to ____
  **/
  grabResults: function(pollkey,polltype,question){
      var url = app.api.root+"/"+polltype+"s/"+pollkey+"/results";
      console.log(url);
      
      //var returnObjects=[]
    
      $.getJSON('https://d84094b0.ngrok.io/?url=' + url, {})
      .done(function( data ) {
        console.log('data', data);
        var stmts = [];
        
        for (var dindex=0;dindex<data.length;dindex++){
          //better actor (participant) info available with paid subscription
          var name = data[dindex].participant_identifier;
          var stmt = {
            actor: {
              name: name,
              mbox: 'mailto:' + 'fakeyfake' + '@fakedomain.com',
            },
            
            verb: {
              id: 'http://adlnet.gov/expapi/verbs/answered',
              display: {
                'en-US': 'answered'
              }
            },
            
            result: {
              response: data[dindex].value
            },
            
            object: {
              id: url,
              definition: {
                name: {
                  'en-US': question
                }
              }
            },
            
            timestamp: data[dindex].created_at
            
          };
          
          var preppedStmt = new TinCan.Statement(stmt);
          
          stmts.push(preppedStmt);
          
          //create an object to make parsing data back easier
          //just grabbing the fields we want for now
          // var dataObject={}
          // dataObject['question'] = question;
          // dataObject['actor'] = data[dindex].participant_identifier;
          // dataObject['value'] = data[dindex].value;
          // dataObject['datestamp'] = data[dindex].created_at;

          //app.recordSet.push(dataObject);
        }
        
        app.xapi.sendStatements(stmts);
      });
  },
  
    grabSurveyJSON: function(surveyUrl){
      var options= {
        // auth: app.api.headers.Authorization
      };
      //reset array to empty values
      app.recordSet=[];
      $.getJSON('https://d84094b0.ngrok.io/?url=' + surveyUrl, options)
      .done(function( data ) {
        console.log('data', data);
        for (var i=0;i<data.polls.length;i++) {
          var poll = data.polls[i]
          app.grabResults(poll.permalink,poll.type,poll.title)
        }
      });
  }, 
  
  
  grabSurvey: function(surveyUrl){
      $.ajax({
        //type: 'GET',
        url: surveyUrl,
        headers:this.api.headers,
        contentType: 'application/json; charset-utf-8',
        dataType: 'json',
        //data:  '{}', 
        success: function (response) { 
          console.log(response)
        },
        failure: function (response) {
          alert("Failure" + response.responseText);
        },
        error: function (response) {
          alert("Error" + response.responseText);
        }
      });
  },
  
  xapi: {
    init: function() {
      app.xapi.lrs = new TinCan.LRS(app.lrs);
    },
    
    sendStatements: function(stmtArray) {
                console.log(stmtArray);

      app.xapi.lrs.saveStatements(stmtArray, {
        callback: function(err, xhr) {
          console.log(err, xhr);
                    if (err !== null) {
                if (xhr !== null) {
                    console.log("Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")");
                    // TODO: do something with error, didn't save statement
                    return;
                }

                console.log("Failed to save statement: " + err);
                // TODO: do something with error, didn't save statement
                return;
            }

            console.log("Statement saved");
            // TOOO: do something with success (possibly ignore)
        }
      });
    }
  
  }
};

document.addEventListener('DOMContentLoaded', app.init());   