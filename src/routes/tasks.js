const express = require('express');
const multer = require('multer');
const router = express.Router();
const taskController = require('../controllers/taskController');
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /tasks:
 *  get:
 *    description: Get all tasks
 *    responses:
 *      200:
 *        description: Success
 */
router.get('/', taskController.getAllTasks);

/**
 * @swagger
 * /tasks:
 *  post:
 *    description: Create a new task
 *    parameters:
 *      - name: task
 *        description: Task object
 *        in: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            description:
 *              type: string
 *              example: My new task
 *    responses:
 *      201:
 *        description: Created
 */
router.post('/', taskController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *  put:
 *    description: Update a task
 *    parameters:
 *      - name: id
 *        description: Task ID
 *        in: path
 *        required: true
 *        type: string
 *      - name: task
 *        description: Task object
 *        in: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            description:
 *              type: string
 *              example: Updated task
 *    responses:
 *      200:
 *        description: Success
 */
router.put('/:id', taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *  delete:
 *    description: Delete a task
 *    parameters:
 *      - name: id
 *        description: Task ID
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      204:
 *        description: No Content
 */
router.delete('/:id', taskController.deleteTask);

/**
 * @swagger
 * /tasks/{id}/upload:
 *  post:
 *    description: Upload a file for a task
 *    parameters:
 *      - name: id
 *        description: Task ID
 *        in: path
 *        required: true
 *        type: string
 *      - name: file
 *        description: File to upload
 *        in: formData
 *        required: true
 *        type: file
 *    responses:
 *      200:
 *        description: Success
 */
router.post('/:id/upload', upload.single('file'), taskController.uploadFile);

module.exports = router;
