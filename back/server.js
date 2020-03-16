const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express() //initialise notre application et notre framework
const Schema = mongoose.Schema // initialise notre schema type a envoyer a notre base de donnée
const router = express.Router() //Sert a initialiser nos route pour le MVC
const cors = require('cors')

app.use(cors()) //Permet de passer outre du blocage cross-origin-ressource-sharing
app.use(bodyParser.json()) //Mettre le corps du texte en JSON

//On défini le port sur lequelle 'parle' notre serveur
app.listen(4000, ()=>{
    console.log('Le serveur marche sue le port 4000 !')
})

const db = "mongodb+srv://DRF:0614012176Df99@cluster0-ybmru.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>console.log('Base de donnée connecté'))
    .catch(err => console.log(err))
;

//Shema
let todoShema = new Schema({
    text: String,
    done: Boolean,
    key: Number
})
let Todo = mongoose.model('Todo', todoShema) //Le Schema est maintenant exporté au sous le noms de Todo

//Routes
app.use('/todo', router) //Ici 'todo' a le role du controller et 'add' du view ! Notre router = express.router voir plus haut

router.route('/').get((req, res)=>{

    Todo.find((err, items) => {
        if (err) {
            console.log(err)
            return res.status(400).json(err)
        }
        res.status(200).json(items)
    })

})

router.route('/:id').put((req, res)=>{

    Todo.findById(req.params.id, (err, todo)=>{
        if (err) {
            return res.send(err)
        }
        todo.text = req.body.text
        todo.done = !req.body.done
        todo.key = req.body.key
        todo.save((err)=>{
            if (err) {
                return res.send(err)
            }
            res.status(200).json('todo bien mise à jour')
        })
    })

})

router.route('/:id').delete((req, res)=>{
    Todo.findByIdAndRemove(req.params.id, (err, todo)=>{

        if (err) {
            return res.send(err)
        }

        todo.text = req.body.text
        todo.done = req.body.done
        todo.key = req.body.key
        todo.save((err)=>{
            if (err) {
                return res.send(err)
            }
            return res.json('Element bien supprimé')
        })
    })
})

//To add to db
router.route('/add').post((req, res) =>{
    //let todo = new Todo({text: 'test 2', isCompleted: false})
    let newTodo = new Todo(req.body)
    newTodo.save()
        .then(()=>console.log('sauvegarde réussi !'), res.status(200).send('newTodo bien ajouté'))
        .catch(err=> {console.log(err), res.status(400).send(err)})
})