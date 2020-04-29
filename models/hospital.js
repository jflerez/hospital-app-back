const mongoose =	require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema =	mongoose.Schema;
const hospitalSchema =	new Schema({
				nombre: {	type: String, unique: true,	required: [true,	'El	nombre	es	necesario']	},
				img: {	type: String,	required: false },
				usuario: {	type: Schema.Types.ObjectId, ref: 'Usuario', required: [true,	'El	usuario es obligatorio']	 }
},	{	collection: 'hospitales' });
hospitalSchema.plugin(uniqueValidator, {message: 'El {PATH} debe ser único'})
module.exports =	mongoose.model('Hospital',	hospitalSchema);