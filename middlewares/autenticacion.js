const jwt = require('jsonwebtoken');
const SEDD = require('../config/config').SEDD;

//Verificar token
exports.verificaToken = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, SEDD, (err, decoded) => {

        if(err){
            return res.status(401).
            json({ok:false, 
                mensaje: 'Token incorrecto',
                 error: err}
                 );
        }

        req.usuario = decoded.usuario;

        next();
        
    });

}