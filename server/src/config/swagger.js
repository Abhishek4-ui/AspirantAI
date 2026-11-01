const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AspirantAI REST API Documentation',
      version: '1.0.0',
      description: 'Production-ready REST API for AspirantAI — Premium 3D AI-Powered All-India Exam Preparation Platform',
      contact: {
        name: 'Abhishek Kumar (MERN Stack Developer)',
        url: 'https://aspirantai.in'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
