const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
let database = require("./db/db.json")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// view routes localhost:3001
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// api or controller routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  // const newNote = {
  //   title: req.body.title,
  //   text: req.body.text,
  //       id: Math.random()
  // }
 
  const newNote = req.body;
  newNote.id = uuidv4();
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  notes.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  
  res.json(newNote);
});

app.delete("/api/notes/:id",(req,res)=>{
  // filter out note with matching req.params.id
  let badNote = req.params.id
  let notesToKeep = []
  console.log(notesToKeep)
  
  for (let i = 0; i < database.length; i++) {
    console.log(database[i].id, req.params.id)
    if (database[i].id != req.params.id){
        notesToKeep.push(database[i])
    }
  }
  console.log(notesToKeep)
  //sets our db.json as equal to notesToKeep array
  database = notesToKeep
  console.log(database)
  // rewrite db.json in new form
  fs.writeFileSync('./db/db.json', JSON.stringify(database), (err) =>{
    if (err) throw err
  });
  
  res.json(database);
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});