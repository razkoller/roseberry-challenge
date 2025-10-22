import bcrypt from 'bcryptjs';
import { pool } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
    try {
        console.log('Starting database seed...');

        // Create demo user
        const hashedPassword = await bcrypt.hash('demo123', 10);

        const userResult = await pool.query(
            `INSERT INTO users (email, password, name) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO UPDATE SET password = $2
       RETURNING id`,
            ['demo@example.com', hashedPassword, 'Demo User']
        );

        const userId = userResult.rows[0].id;
        console.log('Demo user created/updated');

        // Create sample tasks
        const tasks = [
            {
                title: 'Complete project documentation',
                description: 'Write comprehensive README and API documentation',
                isCompleted: false
            },
            {
                title: 'Review pull requests',
                description: 'Check and approve pending PRs from the team',
                isCompleted: true
            },
            {
                title: 'Setup CI/CD pipeline',
                description: 'Configure GitHub Actions for automated testing',
                isCompleted: false
            },
            {
                title: 'Buy groceries',
                description: 'Milk, eggs, bread, and vegetables',
                isCompleted: false
            }
        ];

        // Clear existing tasks for demo user
        await pool.query('DELETE FROM tasks WHERE user_id = $1', [userId]);

        // Insert sample tasks
        for (const task of tasks) {
            await pool.query(
                'INSERT INTO tasks (user_id, title, description, is_completed) VALUES ($1, $2, $3, $4)',
                [userId, task.title, task.description, task.isCompleted]
            );
        }

        console.log('Sample tasks created');
        console.log('\n=== Seed completed successfully ===');
        console.log('Demo credentials:');
        console.log('Email: demo@example.com');
        console.log('Password: demo123');

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        await pool.end();
        process.exit(1);
    }
};

seedDatabase();