const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const modelUser = mongoose.model('User');

let userController = {};

userController.allUsers = (req, res) => {

	modelUser.find()
		.then(results => res.json(results))
		.catch(err => res.send(err));
}

module.exports = userController;

userController.newUser = (req, res) => {

	if(req.body.username && req.body.password){
		if(req.body.password2 && req.body.password == req.body.password2){
			bcrypt.hash(req.body.password, 10)
				.then(hash => {

					let encryptedPassword = hash;

					let newUser = new modelUser({
						username: req.body.username,
						password: encryptedPassword,
						email: req.body.email,
						cpf: req.body.cpf,
						telephone: req.body.telephone;
						weight: req.body.weight;
						height: req.body.height;
						isAdmin: req.body.isAdmin
					});

					newUser.save()
						.then(() => res.json({ sucess: true, message: 'Usuário criado com sucesso', statusCode: 201}));
						.catch(err => res.json({ sucess: false, message: err, statusCode: 500}));				
				})

				.catch(err => res.json({sucess: false, message: err, statusCode: 500}));

		}
		else {
			res.json({ sucess: false, message: 'Senhas não são compatíveis.', statusCode: 400});
		}
	}
	else {
		res.json({sucess: false, message: 'Nome e senhas são obrigatórios', statusCode: 400});
	}
}