const express = require('express');

const app = express();
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');


app.get('/coleccion/:tabla/:busqueda', async (req, res)  => {
    let tabla = req.params.tabla;
    let termino = req.params.busqueda;
    let regex = new RegExp(termino, 'i');

    let listData = [];

    switch (tabla){
        case 'hospital':

            listData = await buscarHospitales(regex);

        break;

        case 'medico':

            listData = await buscarMedicos(regex);

        break;

        case 'usuario':

            listData = await buscarUsuarios(regex);

        break;
    }

    res.status(200).json({
        ok: true,
        [tabla]: listData
    });

})


app.get('/todo/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(regex), 
        buscarMedicos(regex),
        buscarUsuarios(regex)])
        
        .then(data => {
            res.status(200).json({
                ok: true,
                hospitales: data[0],
                medicos: data[1],
                usuarios: data[2]
            });
    
        })

    // buscarHospitales(busqueda, regex).then(hospitales => {
    //     res.status(200).json({
    //         ok: true,
    //         hospitales
    //     });

    // })
    

});

const buscarHospitales = (regex) => {

    return new Promise((resolve, reject) => {

    Hospital.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

        if(err) {
        reject(`Error al cargar hospitales: ${err}`);
        }

        resolve(hospitales);

        // res.status(200).json({
        //     ok: true,
        //     hospitales
        // })

    });
});
}

const buscarMedicos = (regex) => {

    return new Promise((resolve, reject) => {

    Medico.find({nombre: regex})
    .populate('hospital', 'nombre email')
    .exec((err, medicos) => {

        if(err) {
        reject(`Error al cargar medicos: ${err}`);
        }

        resolve(medicos);

        // res.status(200).json({
        //     ok: true,
        //     hospitales
        // })

    });
});
}

const buscarUsuarios = (regex) => {

    return new Promise((resolve, reject) => {

    Usuario.find({}, 'nombre email, rol')
           .or([{'nombre': regex}, {'email': regex}])
           .exec((err, usuarios) => {
               if(err) return reject(`Error al cargar usuarios: ${err}`);
               resolve(usuarios);
           })
});
}

module.exports = app;