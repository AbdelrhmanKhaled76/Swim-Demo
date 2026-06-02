import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ITI React Project – Backend API',
    version: '1.0.0',
    description:
      'Full REST API documentation for the ITI React Project backend. Covers Auth, Users, Organizations, Locations, Inventory, Items, Customers, Orders, and Transactions.',
    contact: {
      name: 'ITI React Project Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>',
      },
    },
    schemas: {
      // ─── Auth ───────────────────────────────────────────────────────────────
      RegisterRequest: {
        type: 'object',
        required: ['username', 'email', 'password', 'confirmPassword'],
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 30, example: 'johndoe' },
          email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
          password: { type: 'string', minLength: 6, example: 'secret123' },
          confirmPassword: { type: 'string', example: 'secret123' },
          role: {
            type: 'string',
            enum: ['Admin', 'WarehouseOwner', 'StoreManager'],
            default: 'StoreManager',
          },
          organizationID: { type: 'string', example: '665f1b2c3d4e5f6a7b8c9d0e' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'johndoe@example.com' },
          password: { type: 'string', example: 'secret123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          token: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              username: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
            },
          },
          message: { type: 'string' },
        },
      },
      // ─── User ───────────────────────────────────────────────────────────────
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['Admin', 'WarehouseOwner', 'StoreManager'] },
          organizationID: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['Admin', 'WarehouseOwner', 'StoreManager'] },
          organizationID: { type: 'string' },
        },
      },
      // ─── Organization ────────────────────────────────────────────────────────
      Organization: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          ownerId: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              username: { type: 'string' },
              email: { type: 'string' },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateOrganizationRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Acme Corp' },
        },
      },
      // ─── Location ────────────────────────────────────────────────────────────
      Location: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          type: { type: 'string', enum: ['Warehouse', 'Store'] },
          locationDetails: { type: 'string' },
          organizationId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateLocationRequest: {
        type: 'object',
        required: ['name', 'type', 'organizationId'],
        properties: {
          name: { type: 'string', example: 'Main Warehouse' },
          type: { type: 'string', enum: ['Warehouse', 'Store'], example: 'Warehouse' },
          locationDetails: { type: 'string', example: '123 Main St, Cairo' },
          organizationId: { type: 'string', example: '665f1b2c3d4e5f6a7b8c9d0e' },
        },
      },
      // ─── Item ────────────────────────────────────────────────────────────────
      Item: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          category: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateItemRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Widget Pro' },
          description: { type: 'string', example: 'A high-quality widget' },
          price: { type: 'number', example: 29.99 },
          category: { type: 'string', example: 'Electronics' },
        },
      },
      // ─── Customer ────────────────────────────────────────────────────────────
      Customer: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateCustomerRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Jane Smith' },
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          phone: { type: 'string', example: '+201234567890' },
        },
      },
      // ─── Order ───────────────────────────────────────────────────────────────
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          customerId: { $ref: '#/components/schemas/Customer' },
          storeId: { $ref: '#/components/schemas/Location' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                itemId: { $ref: '#/components/schemas/Item' },
              },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['customerId', 'storeId', 'items'],
        properties: {
          customerId: { type: 'string', example: '665f1b2c3d4e5f6a7b8c9d0e' },
          storeId: { type: 'string', example: '665f1b2c3d4e5f6a7b8c9d0f' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['itemId'],
              properties: {
                itemId: { type: 'string', example: '665f1b2c3d4e5f6a7b8c9d10' },
              },
            },
          },
        },
      },
      // ─── Inventory ───────────────────────────────────────────────────────────
      Inventory: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          locationId: { type: 'string' },
          itemId: { $ref: '#/components/schemas/Item' },
          quantity: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      // ─── Transaction ─────────────────────────────────────────────────────────
      TransactionItem: {
        type: 'object',
        required: ['name', 'quantity'],
        properties: {
          itemId: { type: 'string', description: 'ID of the item' },
          name: { type: 'string', description: 'Name of the item' },
          quantity: { type: 'number', description: 'Quantity of the item' },
          unitPrice: { type: 'number', description: 'Price per unit in cents' },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          type: { type: 'string', enum: ['sale', 'transfer', 'restock', 'dump'] },
          status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
          amount: { type: 'number' },
          currency: { type: 'string' },
          stripePaymentIntentId: { type: 'string' },
          stripeRefundId: { type: 'string' },
          userId: { type: 'string' },
          locationId: { type: 'string' },
          fromLocationId: { type: 'string' },
          toLocationId: { type: 'string' },
          relatedOrderId: { type: 'string' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/TransactionItem' },
          },
          notes: { type: 'string' },
          metadata: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      // ─── Generic Error ───────────────────────────────────────────────────────
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'An error occurred' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  // Scan all route and controller files for @swagger JSDoc annotations
  apis: [
    './routes/*.js',
    './controllers/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
