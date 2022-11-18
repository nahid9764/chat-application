const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const options = {
	failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Chatting application APIs",
			version: "1.0.0",
		},
		components: {
			securitySchemas: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFromat: "JWT",
				},
			},
		},
		security: [{ bearerAuth: [] }],
	},
	apis: ["./router/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
	// swagger page
	app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

	// Docs in Json format
	app.get("docs.json", (req, res) => {
		res.setHeader("Content-Type", "application-json");
		res.send(swaggerSpec);
	});

	console.log(`Docs available at http://localhost:${process.env.PORT}/docs`);
}

module.exports = { swaggerDocs };
