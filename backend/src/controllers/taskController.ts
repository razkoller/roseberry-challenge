import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';

export const getTasks = async (request: AuthRequest, response: Response): Promise<void> => {
    try {
        const result = await pool.query(
            'SELECT id, title, description, is_completed, created_at, updated_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
            [request.userId]
        );

        response.json({
            tasks: result.rows.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                isCompleted: task.is_completed,
                createdAt: task.created_at,
                updatedAt: task.updated_at
            }))
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        response.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

export const createTask = async (request: AuthRequest, response: Response): Promise<void> => {
    try {
        const { title, description } = request.body;

        if (!title) {
            response.status(400).json({ error: 'Title is required' });
            return;
        }

        const result = await pool.query(
            'INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING id, title, description, is_completed, created_at, updated_at',
            [request.userId, title, description || null]
        );

        const task = result.rows[0];

        response.status(201).json({
            task: {
                id: task.id,
                title: task.title,
                description: task.description,
                isCompleted: task.is_completed,
                createdAt: task.created_at,
                updatedAt: task.updated_at
            }
        });
    } catch (error) {
        console.error('Create task error:', error);
        response.status(500).json({ error: 'Failed to create task' });
    }
};

export const updateTask = async (request: AuthRequest, response: Response): Promise<void> => {
    try {
        const { id } = request.params;
        const { title, description, isCompleted } = request.body;

        const existingTask = await pool.query(
            'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
            [id, request.userId]
        );

        if (existingTask.rows.length === 0) {
            response.status(404).json({ error: 'Task not found' });
            return;
        }

        const result = await pool.query(
            `UPDATE tasks 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           is_completed = COALESCE($3, is_completed),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING id, title, description, is_completed, created_at, updated_at`,
            [title, description, isCompleted, id, request.userId]
        );

        const task = result.rows[0];

        response.json({
            task: {
                id: task.id,
                title: task.title,
                description: task.description,
                isCompleted: task.is_completed,
                createdAt: task.created_at,
                updatedAt: task.updated_at
            }
        });
    } catch (error) {
        console.error('Update task error:', error);
        response.status(500).json({ error: 'Failed to update task' });
    }
};

export const deleteTask = async (request: AuthRequest, response: Response): Promise<void> => {
    try {
        const { id } = request.params;

        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, request.userId]
        );

        if (result.rows.length === 0) {
            response.status(404).json({ error: 'Task not found' });
            return;
        }

        response.status(204).send();
    } catch (error) {
        console.error('Delete task error:', error);
        response.status(500).json({ error: 'Failed to delete task' });
    }
};