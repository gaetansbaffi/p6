const Sauce = require("../models/sauce");
const fs = require("fs-extra");
const sauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);

	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
		likes: 0,
		dislikes: 0,
	});

	sauce
		.save()
		.then(() => res.status(201).json({ message: "objet enregistré" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };

	if (req.file) {
		Sauce.findOne({ _id: req.params.id }).then((sauce) => {
			fs.unlink(`images/${sauce.imageUrl.split("/images/")[1]}`, () => {});
		});
	}

	Sauce.updateOne(
		{ _id: req.params.id },
		{ ...sauceObject, _id: req.params.id }
	)

		.then(() => res.status(200).json({ message: "sauce modifiée." }))
		.catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.remove(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "supprimé" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
	let userId = req.body.userId;
	let like = req.body.like;

	sauce.findOne({ _id: req.params.id }).exec(function (error, sauce) {
		let message = "";
		let userL = sauce.usersLiked.find((user) => user == userId);
		let userD = sauce.usersDisliked.find((user) => user == userId);

		if (like == 0 && userL != undefined) {
			sauce.likes--;
			sauce.usersLiked = sauce.usersLiked.filter((user) => user !== userId);

			message = "vous avez annulé votre like";
		} else if (like == 0 && userD != undefined) {
			sauce.dislikes--;
			sauce.usersDisliked = sauce.usersDisliked.filter(
				(user) => user !== userId
			);

			message = "vous avez annulé votre dislike";
		}

		if (like == 1) {
			sauce.likes++;
			if (sauce.usersLiked.length == 0) {
				sauce.usersLiked = [userId];
			} else {
				sauce.usersLiked.push(userId);
			}

			message = "Like pris en compte !";
		}

		if (like == -1) {
			sauce.dislikes++;
			if (sauce.usersDisliked.length == 0) {
				sauce.usersDisliked = [userId];
			} else {
				sauce.usersDisliked.push(userId);
			}

			message = "Disike pris en compte !";
		}

		sauce
			.save()
			.then(() => res.status(201).json({ message }))
			.catch((error) => {
				res.status(400).json({ error });
			});
	});
};
