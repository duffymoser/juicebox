
const {
    client,
    getAllUsers,
    createUser,
    updateUser // new
  } = require('./index');

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({ username: 'albert', password: 'bertie99', name: 'bertiename', location: 'bertielocation' });
    await createUser({ username: 'sandra', password: '2sandy4me', name: 'sandyname', location: 'sandylocation'  });
    await createUser({ username: 'glamgal', password: 'soglam', name: 'glamname', location: 'glamlocation'  });
    await createUser({ username: 'Number4', password: 'password4', name: 'name4', location: 'location4'  });
    console.log("Finished creating users!");
  } catch(error) {
    console.error("Error creating users!");
    throw error;
  }
}

// then modify rebuildDB to call our new function
async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
}


  async function dropTables() {
    try {
        console.log("Starting to drop tables...");
      await client.query(`
        DROP TABLE if EXISTS posts;
        DROP TABLE IF EXISTS users;
      `);

      console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
      throw error; // we pass the error up to the function that calls dropTables
    }
  }
  
  // this function should call a query which creates all tables for our database 
  async function createTables() {
    try {

        console.log("Starting to build tables...");
      await client.query(`
        CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title varchar(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
      `);

      console.log("Finished building tables!");
    } catch (error) {

        console.error("Error building tables!");
      throw error; // we pass the error up to the function that calls createTables
    }
  }
  
 
  

  async function testDB() {
    try {
      console.log("Starting to test database...");
  
      console.log("Calling getAllUsers")
      const users = await getAllUsers();
      console.log("85 Result:", users);

      //added to test updateUser
      // const newSandra = await updateUser( 2, { name: 'newname2' });
      // console.log(newSandra);
  
      console.log("Calling updateUser on users[0]")
      const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
      });
      console.log("96 Result:", updateUserResult);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.error("Error testing database!");
      throw error;
    }
  }
;
  rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());