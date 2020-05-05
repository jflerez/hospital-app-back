const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEDD = require('../config/config').SEDD;

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = require('../config/config').CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

const app = express();
const Usuario = require('../models/usuario');

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
        
    });

    const payload = ticket.getPayload();
    
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

  }

app.post('/google', async (req, res) => {

    let token = req.body.token;
    let googleUser = await verify(token)
    .catch(e => {
        return res.status(403).
        json({ok:false, 
            mensaje: 'Token no valido',
            error: e
        }
             );
    })


    Usuario.findOne({email: googleUser.email}, (err, user)=>{
        if(err) {
            return res.status(500).
            json({ok:false, 
                mensaje: 'Error al consultar usuario',
                 error: err}
                 );
            }

            if(user) {

                if(user.google === false){

                    return res.status(400).
                json({ok:false, 
                    mensaje: 'Debe usar autenticacion normal',
                     error: err}
                     );

                }else{
                    const token = jwt.sign({usuario: user}, SEDD, { expiresIn: 14400 })

                return res.status(200).json({
                    ok: true,
                    user,
                    id: user._id,
                    token
                })
                }

                
                }else{
                    let usuario = new Usuario();
                    usuario.nombre = googleUser.nombre;
                    usuario.email = googleUser.email;
                    usuario.img = googleUser.img;
                    usuario.google = true;
                    usuario.password = ':)';

                    usuario.save((err, usuarioDB)=>{

                        if(err) return console.log(err);

                        const token = jwt.sign({usuario: usuarioDB}, SEDD, { expiresIn: 14400 })

                    return res.status(200).json({
                        ok: true,
                        usuarioDB,
                        id: usuarioDB._id,
                        token
                    })
                    })

                }
    })

})



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