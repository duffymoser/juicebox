
const {
    client,
    getAllUsers,
    createUser,
    updateUser, // new
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
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
    await createInitialPosts();
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
  
      console.log("Calling getAllUsers");
      const users = await getAllUsers();
      console.log("Result:", users);
  
      console.log("Calling updateUser on users[0]");
      const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
      });
      console.log("Result:", updateUserResult);
  
      console.log("Calling getAllPosts");
      const posts = await getAllPosts();
      console.log("Result:", posts);
  
      console.log("Calling updatePost on posts[0]");
      const updatePostResult = await updatePost(posts[0].id, {
        title: "New Title",
        content: "Updated Content"
      });
      console.log("Result:", updatePostResult);
  
      console.log("Calling getUserById with 1");
      const albert = await getUserById(1);
      console.log("Result:", albert);

      console.log("Calling getUserById with 2");
      const sandra = await getUserById(2);
      console.log("Result:", sandra);

      console.log("Calling getUserById with 3");
      const glamgal = await getUserById(3);
      console.log("Result:", glamgal);

      console.log("Calling getUserById with 4");
      const Number4 = await getUserById(4);
      console.log("Result:", Number4);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.log("Error during testDB");
      throw error;
    }
  }

  async function createInitialPosts() {
    try {
      const [albert, sandra, glamgal, Number4] = await getAllUsers();
  
      await createPost({
        authorId: albert.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them."
      });
  
      await createPost({
        authorId: albert.id,
        title: "Second Post",
        content: "This is my second post. I hope I love writing blogs as much as I love writing them."
      });
  
      await createPost({
        authorId: sandra.id,
        title: "First Post",
        content: "This is my first sandra post. I hope I love writing blogs as much as I love writing them."
      });
  
      await createPost({
        authorId: sandra.id,
        title: "Second Post",
        content: "This is my second sandra post. I hope I love writing blogs as much as I love writing them."
      });
  
      await createPost({
        authorId: glamgal.id,
        title: "First Post",
        content: "This is my first glamorous post. I hope I love writing blogs as much as I love writing them."
      });
  
      await createPost({
        authorId: Number4.id,
        title: "First Post",
        content: "This is my first Nr. 4 post. I hope I love writing blogs as much as I love writing them."
      });
  
      await createPost({
        authorId: Number4.id,
        title: "Second Post",
        content: "This is my second Nr. 4 post. I hope I love writing blogs as much as I love writing them."
      });
  
   
    } catch (error) {
      throw error;
    }
  }



  rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());