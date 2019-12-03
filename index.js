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
        res.status(500).json({ error: 'The users information could not be retrieved' })
    });
 });


// findById(): this method expects an id as it's only parameter and returns the user corresponding to the id provided or an empty array if no user with that id is found.

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(users =>{
      if (users){
        res.status(200).json(users);
      } else { 
          res.status(404).json({ message: "A user with that ID does not exist" })
      };
    })
    .catch( err => {
        console.log('error with GET/api/users/:id', err);
        res.status(500).json({errorMessage: "The users information could not be retrieved"})
    })
});

 // insert(): calling insert passing it a user object will add it to the database and return an object with the id of the inserted user. The object looks like this: { id: 123 }.

 server.post('/api/users', (req, res) => {
    //get data the client sent
    const userData = req.body; //express does not know how to parse json
    console.log(userData);

    if (userData.name && userData.bio) {
        db.insert(userData)
        .then(id => {
            res.status(201).json(id);
            console.log(`${id}`)
        })
        .catch(error => {
            console.log('error with POST /api/users', error);
            res.status(500).json({ errorMessage: 'Error posting a new user', error});
        });
    } 
    else {
        res.status(400).json({ errorMessage: "Please provide a name and bio for user"});
    }
});
    

    //call the db and add the hub


// remove(): the remove method accepts an id as it's first parameter and upon successfully deleting the user from the database it returns the number of records deleted.

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(removed => {
        if(removed){
            res.status(200).json({ message: 'User removed', removed});
        } else {
            res.status(404).json({ message: "A user with that ID does not exist"});
        }
    })
    .catch(err => {
        console.log('error with DELETE /api/users/:id', err);
        res.status(500).json({errorMessage: "User could not be removed"});
    });
});

// update(): accepts two arguments, the first is the id of the user to update and the second is an object with the changes to apply. It returns the count of updated records. If the count is 1 it means the record was updated correctly.

server.put('/api/users/:id', (req, res) => {
    const user = req.body;
    const id = req.params.id;
    db.findById(id)
   
       .then(users =>{
       if (users){
           res.status(200).json(users);
       } else { 
           res.status(404).json({ message: "The user with that ID does not exist" })
       };
       })
       if (user.name && user.bio) {
           db.update(id, user)
           .then(user => {
               res.status(200).json(user);
           }) 
           .catch(err => {
               console.log('error on PUT for /api/users/:id', err);
               res.status(500).json({ errorMessage: "Could not be updated"});
           });
       } else if (user.name && user.bio && !user.id) {
           res.status(404).json({message: "The user with that ID does not exist"});
       }
       else {
           res.status(400).json({ errorMessage: "Provide name and bio for the user"});
       }
   });

const port = 4500;
server.listen(port, () => 
console.log(`\n ** API running on port ${port} \n`)
);