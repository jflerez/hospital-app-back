const express = require('express');
const mongoose = require('mongoose');

const app = express();


//mongoose.connect('mongodb://localhost/hospital', {useNewUrlParser: true});
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=> {

if(err) throw err;

console.log(`Conexion a la base de datos exitosa`);

})



app.get('/', (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    })

});


app.listen(3000, ()=>{
    console.log(`Server listen on port ${3000}`);
})