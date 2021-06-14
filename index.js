const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const expressValidator=require('express-validator');

//importar handmade
const routes = require('./routes/indexRoutes');
const passport = require('./config/passport');
require('dotenv').config({path:'variables.env'});

// helpers con algunas funciones
const helpers = require('./helpers');

// Crear la conexión a la BD
const db = require('./config/db');

// Importar los modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('BD conectada al Servidor'))
    .catch(error => console.log(error));

// crear una app de express
const app = express();

// Cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar Pug para ver las vistas
app.set('view engine', 'pug');

// habilitar json para leer datos del formulario //bodyParser deprecated

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Agregamos express validator a toda la aplicación
// app.use(expressValidator());


// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

app.use(cookieParser());

// sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({ 
    secret: "keyboard cat", 
    resave: false, 
    saveUninitialized: false 
}));

//inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// agregar mensajes flash
app.use(flash());

// Ayudantes
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});


app.use('/', routes() );

const host=process.env.HOST || '0.0.0.0';
const port=process.env.PORT || 8000;

app.listen(port, host, ()=>{
    console.log(`Servidor escuchando puerto ${port}`)
});
