const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//mongoose.connect('mongodb://localhost/hospital', {useNewUrlParser: true});
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=> {

if(err) throw err;

console.log(`Conexion a la base de datos exitosa`);

})



const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');

app.use('/', appRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);

app.listen(3000, ()=>{
    console.log(`Server listen on port ${3000}`);
})