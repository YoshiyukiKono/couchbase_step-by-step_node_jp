const couchbase = require("couchbase");

const cluster = new couchbase.Cluster("couchbase://localhost", {
  username: "Administrator",
  password: "password",
});

const bucket = cluster.bucket("test");

const collection = bucket.defaultCollection();

const user = {
  type: "user",
  id: 1,
  name: "田中",
};

const upsertDocument = async (doc) => {
  try {
    const key = `${doc.type}_${doc.id}`;
    const result = await collection.upsert(key, doc);
    console.log("Upsert: ");
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

upsertDocument(user);

const getDocumentByKey = async (key) => {
  try {
    const result = await collection.get(key);
    console.log("Get: ");
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

getDocumentByKey("user_1");