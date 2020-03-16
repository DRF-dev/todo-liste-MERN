import React, {Component} from 'react'
import '../Todo.css'
import axios from 'axios' //penser au npm install --save axios

class TodoApp extends Component{

    constructor(props){
        super(props)
        this.state = {
            Item: [
                {text: 'item #1', done: false, key: Date.now()+Math.random()}
            ],
            textEnCours: ''
        }
    }
    //componentDidMount execute des trucs au démarage de l'appli
    componentDidMount = ()=>{
        this.fetch()
    }

    //Fetch va aller chercher tout les éléments que l'on a dans notre base de donnée
    fetch = ()=>{
        axios.get('http://localhost:4000/todo')
        .then(res=>{
            this.setState({ Item: res.data }) //res.data est la data de node db
        })
        .catch(err=>{
            console.log(err)
        })
    }

    //Notre action qui va déplacer a l'aide d'un click un élément de la gauche vers la droite
    move = (objet)=> {
        //On ne va prendre que l'élément sélectionné, pour cela on va prendre l'élément dont la key correspond à celle de notre objet.key qui s'appelle key dans cette fonction move
        /*let filtered = this.state.Item.map(itemChange => {
            if (itemChange.key === key) {
                itemChange.done = !itemChange.done
            }
            //On oublie pas de retourner notre item, qu'il ai été modifié ou pas, afin d'avoir du contenue dans notre filtered
            return itemChange
        })

        //On met a jour notre state this.state.Item en lui attribuant des modification si il y'en as
        this.setState({ Item: filtered })*/

        axios.put('http://localhost:4000/todo/'+objet._id, objet)
        .then(()=>{
            this.fetch()
        })
        .catch(err=>{
            console.log(err)
        })
    }


    changementValeur = (e) => {
        this.setState({
            textEnCours: e.target.value
        })
    }

    add = (e) => {
        //On empeche de rafraichir la page en effectuant l'action submit
            //On a mis le preventDefault() dans le onSubmit mais on aurait pût le mettre ici
        //e.preventDefault()

        if (this.state.textEnCours === '') {
            const alert = document.createElement('div')
            alert.className = "alert alert-danger alert-dismissible fade show"
            alert.role = "alert"
            alert.innerHTML = 'Tu n\'a rien écrit'
            document.getElementById('mess').appendChild(alert);

            return window.setTimeout(()=>{
                document.getElementById('mess').removeChild(alert)
            },1000)
        }

        const newItem = {text: this.state.textEnCours, done: false, key: Date.now()+Math.random()}
        this.setState({
            //Item: this.state.Item.concat(newItem),//Ce format ci permet d'inserer à la fin de notre liste
            //Item: [newItem].concat(this.state.Item), //Ce format la insere au début de notre liste
            textEnCours: ''
        })
        
        //Ici sera notre partie "MERN" avec aXios
        axios.post('http://localhost:4000/todo/add', newItem)
        .then(res =>{
            console.log(res.data)
            console.log('success')
            this.fetch()
        })

        const alert = document.createElement('div')
            alert.className = "alert alert-success alert-dismissible fade show"
            alert.role = "alert"
            alert.innerHTML = 'Elément enrengistré'
            document.getElementById('mess').appendChild(alert);

            return window.setTimeout(()=>{
                document.getElementById('mess').removeChild(alert)
            },2000)
    }

    compte = ()=>{
        //filter sert a ne prendre dans notre tableau 'longeurTacheRestante' que les done qui valent false
        let longeurTacheRestante = this.state.Item.filter(filtre=>{
            return filtre.done === false
        })
        
        return longeurTacheRestante.length > 0? `Il reste ${longeurTacheRestante.length.toString()} tâche a effectuer.` : 'Vous n\'avez aucune tâche en cours'
    }

    //On écrit delete comme sa parce que delete est déja un mot réservé
    delet = (objet)=>{
        const MessageDeConfirmation = window.confirm('Etes-vous sûr de vouloir supprimer cet élément ?');
        if (MessageDeConfirmation) {
            //On créer un tableau qui contiendra tout nos élément excepter celui dont la key correspond à la key de notre tableau
            /*let elementAgarder = this.state.Item.filter(item=>{
                return item.key !== key
            })

            //On remplace notre tableau Item par le nouveau tableau avec l'élément en moins
            this.setState({
                Item: elementAgarder
            })*/
            axios.delete('http://localhost:4000/todo/'+objet._id, objet)
            .then(()=> this.fetch())
            .catch(err=>console.log(err))

            const alert = document.createElement('div');
            alert.className = "alert alert-success alert-dismissible fade show";
            alert.role = "alert";
            alert.innerHTML = 'Supression réussi'
            document.getElementById('mess').appendChild(alert);

            return window.setTimeout(()=>{
                document.getElementById('mess').removeChild(alert)
            },2000)

        } else{
            const alert = document.createElement('div')
            alert.className = "alert alert-danger alert-dismissible fade show"
            alert.role = "alert"
            alert.innerHTML = 'Supression annulé'
            document.getElementById('mess').appendChild(alert);

            return window.setTimeout(()=>{
                document.getElementById('mess').removeChild(alert)
            },2000)
        }
    }

    render(){
        return(
            <div className="container">
                <br/>

                <nav className="navbar fixed-top navbar-light bg-light" style={ {zIndex: 1}}>
                    <a className="navbar-brand" href="http://localhost:3000/">Todo-liste</a>
                </nav>

                <div id="mess" style={{ zIndex: 2, position: 'fixed', top: 3, right: 10 }}></div>

                <div className="row" style={ {marginTop:10} }>

                    <div className="col-md-6">
                        {/*todolist est une class importé dans le css, contrairement a row et col qui sont importé via bootstrap */}
                        <div className="todolist">

                            {/* Lorsque l'on met {} apres un ()=> cela signifie que l'on effectue plusieurs actions */}
                            <form onSubmit={(e)=> {e.preventDefault(); this.add(e)} }>
                                <p><label>Ajouter une tâche</label>
                                {/*form-control est une class spécifique de bootstrap */}
                                <input placeholder="add-to-do" onChange={(e)=>this.changementValeur(e)} value={this.state.textEnCours} className="form-control" /></p>
                            </form>

                            {/* Bootstrap: list-unstyled=retire le point que l'on a habituellement au début de chaque élément de la liste */}
                            <ul className="no-padding" id="not-done">
                                {/* On aurait put utiliser if(!objet.done){} aussi */}
                                {this.state.Item.map(objet => {
                                    return objet.done === false ? <li key={objet.key} className="list-unstyled">
                                            <label onClick={()=> this.move(objet)} style={ {cursor: 'pointer'} }>{objet.text}</label>
                                        </li> 
                                        : ''
                                })}
                            </ul>
                            
                            <div className="todo-footer">
                                <span>{this.compte()}</span>
                            </div>

                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="todolist">

                            {/*done-items est un id de notre css et non de bootstrap */}
                            <ul id="done-items">
                                {this.state.Item.map(objet => {
                                    return objet.done === true ? 
                                        <li 
                                            key={objet.key}  
                                            className="list-unstyled"
                                            style={ {display: "flex", justifyContent: "space-between"} }>
                                            <label onClick={()=> {this.move(objet._id)}} style={ {cursor: 'pointer'} }>{objet.text}</label> 
                                            <button className="btn btn-outline-danger my-2 my-sm-0"
                                                onClick={e=>this.delet(objet)}>
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </li> 
                                        : ''
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TodoApp