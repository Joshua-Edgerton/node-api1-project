const express = require('express'); //CommonJS modules
const db = require('./data/db'); // import database file
const server = express();
server.use(express.json()); //needed to parse json from body


server.get('/', (req, res) => {
    res.send({ api: 'up and running...'})
 })

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

 server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(error => {
        console.log('error on GET /api/users', error);
    });
 });

 server.get('/api/users/:id', (req, res) => {
    db.findById()
    .then(id => {
        res.status(200).json(id);
    })
    .catch(error => {
        console.log('error on GET /api/users/:id', error);
    });
 });

const port = 4500;
server.listen(port, () => 
console.log(`\n ** API running on port ${port} \n`)
);