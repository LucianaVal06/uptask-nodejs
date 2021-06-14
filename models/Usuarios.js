const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');

const db = require('../config/db');
const Proyectos = require('../models/Proyectos');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull : false, 
        validate: {
            isEmail: {
                msg : 'Agrega un Correo Válido'
            },
            notEmpty: {
                msg: 'Tienes que escribir un e-mail'
            }
        }, 
        unique: {
            args: true,
            msg: 'Usuario Ya Registrado'
        }
    },  
    password: {
        type: Sequelize.STRING(60), 
        allowNull: false, 
        validate: {
            notEmpty: {
                msg: 'Tienes que escribir una contraseña'
            }
        }
    }, 
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }, 
    token: Sequelize.STRING, 
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10) );
        }
    }
});

// Métodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
