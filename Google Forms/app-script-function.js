var endpoint = '';
var username = '';
var password = '';

var verbList = {
	experienced: 'http://adlnet.gov/expapi/verbs/experienced',
	attended: 'http://adlnet.gov/expapi/verbs/attended',
	completed: 'http://adlnet.gov/expapi/verbs/completed',
	answered: 'http://adlnet.gov/expapi/verbs/answered',
	attempted: 'http://adlnet.gov/expapi/verbs/attempted',
	shared: 'http://adlnet.gov/expapi/verbs/shared',


	watched: 'http://activitystrea.ms/schema/1.0/watch',
	visited: 'http://adlnet.gov/expapi/verbs/visited',
	arrived: 'http://adlnet.gov/expapi/verbs/arrived',
	played: 'http://activitystrea.ms/schema/1.0/play',
	mentored: 'http://id.tincanapi.com/verb/mentored',
	joined: 'http://activitystrea.ms/schema/1.0/join',
	'checked in': 'http://activitystrea.ms/schema/1.0/checkin',
	listened: 'http://activitystrea.ms/schema/1.0/listen',
	presented: 'http://activitystrea.ms/schema/1.0/present',
	read: 'http://activitystrea.ms/schema/1.0/read',
	started: 'http://activitystrea.ms/schema/1.0/start',
	interviewed: 'http://id.tincanapi.com/verb/interviewed',
	earned: 'http://id.tincanapi.com/verb/earned',

};

function getVerbID(verb) {
	return verbList[verb] || 'http://adlnet.gov/expapi/verbs/experienced';
}

function buildStatement(data) {
	var verbField = data['Verb'][0];
	var tagArray = data['Tags'][0].split(',');

	var trimmedTags = [];
	tagArray.forEach(function (tag) {
		trimmedTags.push(tag.trim());
	});

	var dateNow = new Date().toISOString();

	var stmt = {
		actor: {
			name: data.Name[0],
			mbox: 'mailto:' + data.Email[0]
		},

		verb: {
			id: getVerbID(verbField),
			display: {
				"en-US": verbField
			}
		},

		object: {
			id: data['Activity URL'][0],
			definition: {
				name: {
					"en-US": data['Activity Name'][0]
				},
				description: {
					"en-US": data['Activity Description'][0]
				}

			}
		},

		context: {
			extensions: {
				"http://www.torrancelearning.com/xapi-cohort/extensions/": {
					date: data['Activity Date'][0] || dateNow,
					tags: trimmedTags,
					notes: data['Notes'][0]
				}
			}
		},

		timestamp: dateNow

	};


	sendStatement(stmt);
}

function sendStatement(stmt) {
	var options = {
		'method': 'post',
		'contentType': 'application/json',
		'payload': JSON.stringify(stmt),
		'headers': {
			'Authorization': 'Basic ' + Utilities.base64Encode(username + ':' + password),
			'X-Experience-API-Version': '1.0.0',
		}
	};


	var response = UrlFetchApp.fetch(endpoint, options);
	Logger.log('LRS response: ' + response);
}

function onFormSubmit(e) {
	var data = e.namedValues;

	Logger.log('form data' + data);
	buildStatement(data);
}

function onOpen() {
	var ss = SpreadsheetApp.getActive();
	ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(ss).onFormSubmit()
		.create();
}