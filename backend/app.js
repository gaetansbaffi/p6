const express = require("express");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const helmet = require("helmet");
const path = require("path");
const sauceRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const config = require("./config");

mongoose
	.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
app.use(helmet());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

app.use(bodyParser.json({ limit: "5mb" }));
app.use(mongoSanitize());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
