const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();
app.use(fileUpload());

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');


app.put('/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    const id = req.params.id;
    console.log(id);

    //Tipos de coleccion
    let tiposValidos = ['hospitales', 'usuarios', 'medicos'];

    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(404).
        json({ok:false, 
            mensaje: 'Tipo de colección no valida',
             error: {message: 'Tipo de colección no valida'}}
             );
    }

    if(!req.files){
        return res.status(404).
        json({ok:false, 
            mensaje: 'No se seleccionó nada',
             error: {message: 'No se seleccionó una imagen'}}
             );
        }

        //Obtener nombre de archivo
        let archivo = req.files.imagen;
        let nombreCortado = archivo.name.split('.');
        let extension = nombreCortado[nombreCortado.length - 1];

        //Extensiones permitidas
        let extensionesPermitidas = ['png', 'jpg', 'jpeg'];

        if(extensionesPermitidas.indexOf(extension) < 0 ){
            return res.status(404).
            json({ok:false, 
                mensaje: 'Extensión no valida',
                 error: {message: `La extensiones validas son ${extensionesPermitidas}`}}
                 );
            }

            // Nombre de archivo personalizado
           let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

           //Mover el archivo a un path
           let path = `./uploads/${tipo}/${nombreArchivo}`;

           archivo.mv(path, err =>{

            if(err){
                return res.status(500).
                json({ok:false, 
                    mensaje: 'Error al mover archivo',
                     error: err
                 });
            }

        });


        subirImagen(tipo, id, nombreArchivo, res);

});

const subirImagen = (tipo, id, nombreArchivo, res) => {

    switch(tipo){
        case 'usuarios':

       Usuario.findById(id, (err, usuario) => {
           console.log(`usuario: ${usuario}`);
           let oldPath = `./uploads/usuarios/${usuario.img}`;
           console.log(`oldPath: ${oldPath}`);

           //Si existe una imagen la elimina
           if(usuario.img){
           if(fs.existsSync(oldPath)){
               fs.unlinkSync(oldPath);
           }
        }

           usuario.img = nombreArchivo;
           usuario.save((err, usuarioUpdate)=>{
               delete usuarioUpdate.password;

            res.status(200).json({
                ok: true,
                mensaje: 'Imgen de usuario actualizada',
                usuario: usuarioUpdate
            })

           })

       });

        break;

        case 'medicos':

            Medico.findById(id, (err, medico) => {
        
                let oldPath = `./uploads/medicos/${medico.img}`;
                console.log(`oldPath: ${oldPath}`);
     
                //Si existe una imagen la elimina
                if(medico.img){
                if(fs.existsSync(oldPath)){
                    fs.unlinkSync(oldPath);
                }
             }
     
                medico.img = nombreArchivo;
                medico.save((err, medicoUpdate)=>{
     
                 res.status(200).json({
                     ok: true,
                     mensaje: 'Imgen de medico actualizada',
                     medico: medicoUpdate
                 })
     
                })
     
            });

        break;

        case 'hospitales':

            Hospital.findById(id, (err, hospital) => {
        
                let oldPath = `./uploads/hospitales/${hospital.img}`;
                console.log(`oldPath: ${oldPath}`);
     
                //Si existe una imagen la elimina
                if(hospital.img){
                if(fs.existsSync(oldPath)){
                    fs.unlinkSync(oldPath);
                }
             }
     
             hospital.img = nombreArchivo;
             hospital.save((err, hospitalUpdate)=>{
     
                 res.status(200).json({
                     ok: true,
                     mensaje: 'Imgen de hospital actualizada',
                     hospital: hospitalUpdate
                 })
     
                })
     
            });

        break;
    }

}

module.exports = app;