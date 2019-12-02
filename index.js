const express = require('express'); //CommonJS modules
const db = require('./data/db'); // import database file
const server = express();
server.use(express.json()); //needed to parse json from body


server.get('/', (req, res) => {
    res.send({ api: 'up and running...'})
 })

// find(): calling find returns a promise that resolves to an array of all the users contained in the database.

 server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(error => {
        console.log('error on GET /api/users', error);
    });
 });


// findById(): this method expects an id as it's only parameter and returns the user corresponding to the id provided or an empty array if no user with that id is found.

 server.get('/api/users/:id', (req, res) => {
     const id = req.params.id;
    db.findById(id)
    .then(id => {
        res.status(200).json(id);
    })
    .catch(error => {
        console.log('error on GET /api/users/:id', error);
    });
 });

 // insert(): calling insert passing it a user object will add it to the database and return an object with the id of the inserted user. The object looks like this: { id: 123 }.

 server.post('/api/users', (req, res) => {
    //get data the client sent
    const userData = req.body; //express does not know how to parse json

    //call the db and add the hub
    db.insert(userData)
    .then(id => {
        res.status(201).json(id);
    })
    .catch(error => {
        console.log('error on POST /api/users', error);
        res.status(500).json({ errorMessage: 'error posting a new user', error});
    });
});

// remove(): the remove method accepts an id as it's first parameter and upon successfully deleting the user from the database it returns the number of records deleted.

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(id => {
        res.status(200).json({ message: `Succesfully deleted user`})
    })
    .catch(error => {
        console.log("error with DELETE user by id", error);
    });
});

const port = 4500;
server.listen(port, () => 
console.log(`\n ** API running on port ${port} \n`)
);