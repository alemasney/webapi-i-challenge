const express = require('express');
const db = require('./data/db');

const server = express();

server.use(express.json());

server.get('/api/users', ( req, res ) => {
    db.find()
        .then( user => {
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json({ success: false, error: "The users information could not be retrieved" })
        })
})

server.post('/api/users', ( req, res ) => {
    const newUser = req.body;

    db.insert(newUser)
        .then( addedUser => {
            if(addedUser) {
                res.status(201).json({ success: true, addedUser });
            } else {
                res.status(400).json({ success: false, errorMessage: "Please provide name and bio for the user." });
            }
        })
         .catch( error => {
             res.status(500).json({ success: false, error: 'There was an error while saving the user to the database'})
         })
});

// server.get('/api/user/:id', ( req, res ) => {
//     const { id } = req.params;

//     db.findById(id)
//         .then( user => {
//             if(user) {
//                 res.status(200).json({ success: true, user })
//             } else {
//                 res.status(404).json({ success: false, message: "The user with the specified ID does not exist." })
//             }
//         })
//         .catch(res.status(500).json({ success: false, error: "The user information could not be retrieved." }))
// })

server.delete('/api/users/:id', ( req, res) => {
    const { id } = req.params;

    db.remove(id)
        .then( deletedItem => {
            if(deletedItem) {
                res.status(204).end();
            } else {
                res.status(404).json({ success: false, message: "The user with the specified ID does not exist." })
            }
        })
        .catch(res.status(500).json({ success: false, error: "The user could not be removed"}))
})

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const userInfo = req.body;

    db.update(id, userInfo)
        .then( updated => {
            if(updated) {
                res.status(200).json({ success: true, updated })
            } else {
                res.status(400).json({ success: false, message: "The user with the specified ID does not exist."})
            }
        })
        .catch(res.status(500).json({ success: false, errorMessage: "The user information could not be modified." }))
})

server.listen(8000, () => {
    console.log('listening on port 8000');
})