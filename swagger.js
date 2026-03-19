import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API de byarshop",
    description: "Documentación de la API de byarshop",
  },
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";

const endpointsFiles = ["./src/app.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
