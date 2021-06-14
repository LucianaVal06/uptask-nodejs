const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Ref Modelo donde autenticar
const Usuarios = require('../models/Usuarios');

// local strategy - Login con credenciales propios (US y PASS)
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField : 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email, 
                        activo: 1
                    }
                });
                // US existe , pass incorrecto
                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message : 'Contraseña Incorrecta'
                    })
                } 
                // US existe y Pass correcto
                return done(null, usuario);
            } catch (error) {
                // Ese usuario no existe
                return done(null, false, {
                    message : 'Esa cuenta no existe'
                })
            }
        }
    )
);

// serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// exportar
module.exports = passport;