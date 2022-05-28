import express from "express";
import bcrypt from "bcrypt";
import { initializeApp } from "firebase/app";
import{ getFirestore, doc, collection, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdg9AIv1rw-vu2z7G5BcGmFz5d0ODx_R0",
  authDomain: "start-up-project-25eba.firebaseapp.com",
  projectId: "start-up-project-25eba",
  storageBucket: "start-up-project-25eba.appspot.com",
  messagingSenderId: "724437187004",
  appId: "1:724437187004:web:0033f4ccea88ceba8913b9"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();

// init server
const app = express();

//middlewares
app.use(express.static("public"));
app.use(express.json()) // enables form sharing

//routes
//home route
app.get('/', (req, res) => {
    res.sendFile("index.html", { root : "public"})
})

// signup 
app.get('/signup', (req, res) => {
    res.sendFile("signup.html", { root : "public" })
})

app.post('/signup', (req, res) => {
    const { name, email, password, number, tac} = req.body

    //form validations
    if(name.length < 3){
        res.json({ 'alert' : 'name must be 3 letters long'});
    } else if(!email.length){
        res.json({'alert' : 'enter your email'});
    } else if(password.length < 8){
        res.json({'alert' : 'password must be 8 letters long'});
    } else if(!Number(number) || number.length < 10){
        res.json({'alert' : 'invalid number, please enter valid one'});
    } else if(!tac.checked){
        res.json({'alert' : 'you must agree to our terms and conditions'});
    } else{
        //store data
        const users = collection(db, "users");

        getDoc(doc(users, email)).then(user => {
            if(user.exists()){
                return res.json({ 'alert' : 'email already exists' })
            } else{
                //encrypt the password 
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;
                        req.body.seller = false;

                        //set the doc 
                        setDoc(doc(users, email), req.body).then(data => {
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                                seller: req.body.seller,
                            })
                        })
                    })
                })
            }
        })
    }
})

//404 route
app.get('/404', (req, res) => {
    res.sendFile("404.html", { root : "public" })
})

app.use((req, res) => {
    res.redirect('/404')
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})