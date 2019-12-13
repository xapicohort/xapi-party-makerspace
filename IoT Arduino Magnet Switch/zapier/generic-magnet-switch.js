// Edit user variable values ================================ /
const activityIdPrefix = 'xxxxxxxxxxxxxxxxx'; // URL prefix

const endpoint = inputData.endpoint || '';
const auth = ('Basic ' + inputData.auth) || ''; // Base64 encoded (key:secret)

const actor = {
  name: inputData.actorName || '',
  mbox: ('mailto:' + inputData.actorMbox) || ''
}

const activityName = inputData.activityName || '';
const activityIdSuffix = slugify(activityName) || '';

const activity = {
  id: activityIdPrefix + activityIdSuffix,
  name: activityName, // optional
  desc: '', // optional (if name exists)

  parent: {
    id: '', // optional
    name: '', // optional
    desc: '', // optional (if name exists)
  }
}

// The below can be edited if needed ================================ /
function slugify(text) {
  if (!text || typeof text !== 'string') { return ''; }

  const output = encodeURIComponent(text.toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, 'and')           // Replace ampersand with "and"
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text  
  );

  return output;
}

const output = { response: "" };

let status = inputData.status;
const statusNum = inputData.statusNum;

if (status === "open") {
  status = "opened";
}

const verbs = {
  opened: "http://activitystrea.ms/schema/1.0/open",
  closed: "http://activitystrea.ms/schema/1.0/close"
};

const stmt = {
  actor,
  verb: {
    id: verbs[status],
    display: {
      'en-US': status
    }
  },
  context: {
    extensions: {
      'http://www.torrancelearning.com/xapi/activities/extensions/sensors/statusNum': statusNum
    }
  },
  timestamp: (new Date()).toISOString()
};


function createActivityObj(obj) {
  const id = obj.id;
  const name = obj.name;
  const desc = obj.desc;

  const activityObj = { id };

  if (name) {
    activityObj.definition = {
      name: { 'en-US': name }
    };

    if (desc) {
      activityObj.definition.description = {
        'en-US': desc
      }
    }
  }

  return activityObj;
}

stmt.object = createActivityObj(activity);

if (activity.parent.id) {
  const parentObj = createActivityObj(activity.parent);

  stmt.context.contextActivities = stmt.context.contextActivities || {};
  stmt.context.contextActivities.parent = [parentObj];
}

console.log(JSON.stringify(stmt));

if (!endpoint || !auth) {
  callback('xAPI credentials not present', null);
  return;
}

fetch(endpoint.replace(/\/?$/, '/') + 'statements', {
  method: 'POST',
  headers: {
    'X-Experience-API-Version': '1.0.0',
    'Content-Type': 'application/json',
    'Authorization': auth
  },
  body: JSON.stringify(stmt)
})

  .then(res => {
    console.log(res);
    return res.json();
  }).then(json => {
    console.log(json);
    json = json || {};
    output.response = json;
    callback(null, output);
  }).catch((err, response) => {
    console.error('Error:', err, response);
    callback(err, response);
  });
