const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEDD = require('../config/config').SEDD;
const mdAutenticacion = require('../middlewares/autenticacion');

const app = express();
const Hospital = require('../models/hospital');

app.get('/', (req, res) => {
    

    Hospital.find({})
    .populate('usuario', 'nombre email')
    .exec(
        (err, hospital)=>{
        if(err) {
        return res.status(500).
        json({ok:false, 
            mensaje: 'Error listando hospitales',
             error: err}
             );
        }

        res.status(200).json({
            ok: true,
            hospital
        })


    })

});



// Crear nuevo usuario

app.post('/', mdAutenticacion.verificaToken, (req, res) =>{
  let {body} = req;
  console.log(body);
  console.log('req.usuario.id', req.usuario._id);

  const hospital = new Hospital({
      nombre: body.nombre,
      img: body.img,
      usuario: req.usuario._id
  });

  hospital.save((err, hospitalSave)=>{
    if(err) {
        return res.status(500).
        json({ok:false, 
            mensaje: 'Error al crear hospital',
             error: err}
             );
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalSave
        })


  });
})


//Actualizar usuario

app.put('/:id', mdAutenticacion.verificaToken, (req, res)=>{

    let id = req.params.id;
    let {body} = req;

    Hospital.findById(id, (err, hospital)=>{

        if(err) {
            return res.status(500).
            json({ok:false, 
                mensaje: 'Error al consultar hospital',
                 error: err}
                 );
            }

        if(!hospital){
            return res.status(400).
            json({ok:false, 
                mensaje: `El hospital con el id: ${id} no existe`,
                 error: {message: 'No existe un hospital con ese ID'}}
                 );
            }

            hospital.nombre = body.nombre;
            hospital.img = body.img;
            hospital.usuario = req.usuario._id;

            hospital.save((err, hospitalEdit)=>{
                if(err) {
                    return res.status(400).
                    json({ok:false, 
                        mensaje: 'Error al actualizar usuario',
                         error: err}
                         );
                    }

                    res.status(200).json({
                        ok: true,
                        hospital: hospitalEdit
                    })
            })
        });
    
    });

    //Eliminar usuario

    app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

        let id = req.params.id;

        Hospital.findByIdAndRemove(id, (err, hospitalDeleted) => {

            if(err) {
                return res.status(400).
                json({ok:false, 
                    mensaje: 'Error al eliminar hospital',
                     error: err}
                     );
                }

                if(!hospitalDeleted){

                    return res.status(400).
                json({ok:false, 
                    mensaje: 'No existe un hospital con ese id',
                     errors: {message: 'No existe un hospital con ese id'}}
                     );
                }

                res.status(200).json({
                    ok: true,
                    hospital: hospitalDeleted
                })

        })

    });


module.exports = app;