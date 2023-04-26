const yaml = require('yamljs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const components = yaml.load('./swagger/components.yaml');
const getOrders = yaml.load('./swagger/get_orders.yaml');
const getOrderById = yaml.load('./swagger/get_orderbyid.yaml');
const postOrder = yaml.load('./swagger/post_order.yaml');
const putOrderById = yaml.load('./swagger/put_orderbyid.yaml');
const deleteOrderById = yaml.load('./swagger/delete_orderbyid.yaml');

function swaggerInit(appInstance) {
  const allSwagger = {
    ...components,
    paths: {
      ...getOrders,
      ...getOrderById,
      ...postOrder,
      ...putOrderById,
      ...deleteOrderById,
    },
  };

  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Order API',
        version: '1.0.0',
        description: 'An API to manage orders',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT ?? 5001}`,
        },
      ],
      ...allSwagger, // Use the merged Swagger documentation object
    },
    apis: [], // No need to specify the APIs here, as we are providing the documentation directly in the definition
  };

  const specs = swaggerJsdoc(swaggerOptions);
  appInstance.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = swaggerInit;
