const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEDD = require('../config/config').SEDD;
const mdAutenticacion = require('../middlewares/autenticacion');

const app = express();
const Medico = require('../models/medico');

app.get('/', (req, res) => {

    Medico.find({})
    .exec(
        (err, medico)=>{
        if(err) {
        return res.status(500).
        json({ok:false, 
            mensaje: 'Error listando medicos',
             error: err}
             );
        }

        res.status(200).json({
            ok: true,
            medico
        })


    })

});



// Crear nuevo usuario

app.post('/', mdAutenticacion.verificaToken, (req, res) =>{
  let {body} = req;
  console.log(body);
  console.log('req.usuario.id', req.usuario._id);

  const medico = new Medico({
      nombre: body.nombre,
      img: body.img,
      usuario: req.usuario._id,
      hospital: body.hospital
  });

  medico.save((err, medicoSave)=>{
    if(err) {
        return res.status(500).
        json({ok:false, 
            mensaje: 'Error al crear medico',
             error: err}
             );
        }

        res.status(200).json({
            ok: true,
            medico: medicoSave
        })


  });
})


//Actualizar usuario

app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    let id = req.params.id;
    let {body} = req;

    Medico.findById(id, (err, medico)=>{

        if(err) {
            return res.status(500).
            json({ok:false, 
                mensaje: 'Error al consultar medico',
                 error: err}
                 );
            }

        if(!medico){
            return res.status(400).
            json({ok:false, 
                mensaje: `El medico con el id: ${id} no existe`,
                 error: {message: 'No existe un medico con ese ID'}}
                 );
            }

            medico.nombre = body.nombre;
            medico.img = body.img;
            medico.usuario = req.usuario._id;
            medico.hospital = body.hospital;

            medico.save((err, medicoEdit)=>{
                if(err) {
                    return res.status(400).
                    json({ok:false, 
                        mensaje: 'Error al actualizar medico',
                         error: err}
                         );
                    }

                    res.status(200).json({
                        ok: true,
                        medico: medicoEdit
                    })
            })
        });
    
    });

    //Eliminar usuario

    app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

        let id = req.params.id;

        Medico.findByIdAndRemove(id, (err, medicoDeleted) => {

            if(err) {
                return res.status(400).
                json({ok:false, 
                    mensaje: 'Error al eliminar medico',
                     error: err}
                     );
                }

                if(!medicoDeleted){

                    return res.status(400).
                json({ok:false, 
                    mensaje: 'No existe un medico con ese id',
                     errors: {message: 'No existe un medico con ese id'}}
                     );
                }

                res.status(200).json({
                    ok: true,
                    medico: medicoDeleted
                })

        })

    });


module.exports = app;