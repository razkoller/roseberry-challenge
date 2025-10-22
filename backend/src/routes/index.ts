import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/tasks', authenticateToken, getTasks);
router.post('/tasks', authenticateToken, createTask);
router.put('/tasks/:id', authenticateToken, updateTask);
router.delete('/tasks/:id', authenticateToken, deleteTask);

export default router;