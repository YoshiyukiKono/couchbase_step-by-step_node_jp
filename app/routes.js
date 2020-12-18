var path = require('path');
var couchbase = require('couchbase');

var cluster = new couchbase.Cluster(
    'couchbase://localhost',
    {
      username: 'Administrator',
      password: 'password'
    }
  );

const bucket = cluster.bucket("node_app");
const qs = `SELECT name, id from node_app WHERE type='user'`; 

const collection = bucket.defaultCollection();

const upsertDocument = async (doc) => {
  try {
    const key = `${doc.type}_${doc.id}`;
    const result = await collection.upsert(key, doc);
  } catch (error) {
    console.error(error);
  }
};

const removeUser = async (id) => {
  try {
    const key = `user_${id}`;
    const result = await collection.remove(key);
  } catch (error) {
    console.error(error);
  }
};

const selectUsers = async (key) => { 
  const result = await cluster.query(qs, {
    scanConsistency: couchbase.QueryScanConsistency.RequestPlus,
  });
  return result.rows;
}

var routes = function(app) {
    app.get('/users', async (req, res) => {      
        const rows = await selectUsers();
        res.json(rows);
      });
    app.post('/user', function(req, res) {
      const user = {
        type: "user",
        id: req.body.id,
        name: req.body.name,
      };
      upsertDocument(user);
      res.json({});
    });
    app.delete("/user/:id", function(req, res) {
      removeUser(req.query.id);
      res.json({});
  });
};
module.exports = routes;