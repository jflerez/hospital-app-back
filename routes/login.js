const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEDD = require('../config/config').SEDD;

const app = express();
const Usuario = require('../models/usuario');

app.post('/', (req, res) => {

   let {body} = req;

   Usuario.findOne({email: body.email}, (err, usuario) => {

    if(err) {
        return res.status(500).
        json({ok:false, 
            mensaje: 'Error al consultar usuario',
             error: err}
             );
        }

        if(!usuario){
            return res.status(400).
        json({ok:false, 
            mensaje: 'Error al consultar usuario',
             error: err}
             );
        }

        if(!bcrypt.compareSync(body.password, usuario.password)){
            return res.status(400).
            json({ok:false, 
                mensaje: 'Credenciales incorrectas',
                 error: err}
                 );
        }

        //Crear token
        usuario.password = '=)';
        const token = jwt.sign({usuario: usuario}, SEDD, { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            usuario,
            id: usuario.id,
            token
        })



        });

   })


module.exports = app;