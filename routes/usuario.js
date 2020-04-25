const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEDD = require('../config/config').SEDD;
const mdAutenticacion = require('../middlewares/autenticacion');

const app = express();
const Usuario = require('../models/usuario');

app.get('/', (req, res) => {

    Usuario.find({}, 'nombre email img role')
    .exec(
        (err, usuarios)=>{
        if(err) {
        return res.status(500).
        json({ok:false, 
            mensaje: 'Error listando usuarios',
             error: err}
             );
        }

        res.status(200).json({
            ok: true,
            usuarios
        })


    })

});



// Crear nuevo usuario

app.post('/', mdAutenticacion.verificaToken, (req, res) =>{
  let {body} = req;
  console.log(body);

  const usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      img: body.img,
      role: body.role
  });

  usuario.save((err, usuarioSave)=>{
    if(err) {
        return res.status(500).
        json({ok:false, 
            mensaje: 'Error al crear usuario',
             error: err}
             );
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioSave
        })


  });
})


//Actualizar usuario

app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    let id = req.params.id;
    let {body} = req;

    Usuario.findById(id, (err, usuario)=>{

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
                mensaje: `El usuario con el id: ${id} no existe`,
                 error: {message: 'No existe un usuario con ese ID'}}
                 );
            }

            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;

            usuario.save((err, userEdit)=>{
                if(err) {
                    return res.status(400).
                    json({ok:false, 
                        mensaje: 'Error al actualizar usuario',
                         error: err}
                         );
                    }

                    userEdit.password = '=)';

                    res.status(200).json({
                        ok: true,
                        usuario: userEdit
                    })
            })
        });
    
    });

    //Eliminar usuario

    app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

        let id = req.params.id;

        Usuario.findByIdAndRemove(id, (err, userDeleted) => {

            if(err) {
                return res.status(400).
                json({ok:false, 
                    mensaje: 'Error al eliminar usuario',
                     error: err}
                     );
                }

                if(!userDeleted){

                    return res.status(400).
                json({ok:false, 
                    mensaje: 'No existe un usuario con ese id',
                     errors: {message: 'No existe un usuario con ese id'}}
                     );
                }

                res.status(200).json({
                    ok: true,
                    usuario: userDeleted
                })

        })

    });


module.exports = app;