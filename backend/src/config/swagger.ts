import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'A simple CRUD API for managing tasks with authentication',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        isCompleted: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'password', 'name'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 },
                        name: { type: 'string' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string' },
                    },
                },
                CreateTaskRequest: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                    },
                },
                UpdateTaskRequest: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        isCompleted: { type: 'boolean' },
                    },
                },
            },
        },
        paths: {
            '/auth/register': {
                post: {
                    summary: 'Register a new user',
                    tags: ['Authentication'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/RegisterRequest' },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'User registered successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            user: { $ref: '#/components/schemas/User' },
                                            token: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                        409: { description: 'Email already registered' },
                    },
                },
            },
            '/auth/login': {
                post: {
                    summary: 'Login user',
                    tags: ['Authentication'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/LoginRequest' },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Login successful',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            user: { $ref: '#/components/schemas/User' },
                                            token: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: 'Invalid credentials' },
                    },
                },
            },
            '/tasks': {
                get: {
                    summary: 'Get all tasks for authenticated user',
                    tags: ['Tasks'],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Tasks retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            tasks: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Task' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: 'Unauthorized' },
                    },
                },
                post: {
                    summary: 'Create a new task',
                    tags: ['Tasks'],
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CreateTaskRequest' },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Task created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            task: { $ref: '#/components/schemas/Task' },
                                        },
                                    },
                                },
                            },
                        },
                        401: { description: 'Unauthorized' },
                    },
                },
            },
            '/tasks/{id}': {
                put: {
                    summary: 'Update a task',
                    tags: ['Tasks'],
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'integer' },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UpdateTaskRequest' },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Task updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            task: { $ref: '#/components/schemas/Task' },
                                        },
                                    },
                                },
                            },
                        },
                        404: { description: 'Task not found' },
                    },
                },
                delete: {
                    summary: 'Delete a task',
                    tags: ['Tasks'],
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'integer' },
                        },
                    ],
                    responses: {
                        204: { description: 'Task deleted successfully' },
                        404: { description: 'Task not found' },
                    },
                },
            },
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);