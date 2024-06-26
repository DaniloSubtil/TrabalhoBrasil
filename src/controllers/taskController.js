const AWS = require('aws-sdk');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient({
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://dynamodb-local:8000', // Endpoint para DynamoDB local
});

const sqs = new AWS.SQS({
    endpoint: process.env.SQS_ENDPOINT || 'http://localstack:4566', // Endpoint para SQS local
});

const TABLE_NAME = 'Tasks';

const getAllTasks = (req, res) => {
    const params = {
        TableName: TABLE_NAME,
    };

    dynamoDB.scan(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Could not retrieve tasks' });
        } else {
            res.json(data.Items);
        }
    });
};

const createTask = (req, res) => {
    const { description } = req.body;
    const id = uuid.v4();

    const params = {
        TableName: TABLE_NAME,
        Item: { id, description },
    };

    dynamoDB.put(params, (err) => {
        if (err) {
            res.status(500).json({ error: 'Could not create task' });
        } else {
            sendSqsMessage({ id, description });
            res.status(201).json({ id, description });
        }
    });
};

const updateTask = (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    const params = {
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set description = :d',
        ExpressionAttributeValues: { ':d': description },
        ReturnValues: 'UPDATED_NEW',
    };

    dynamoDB.update(params, (err) => {
        if (err) {
            res.status(500).json({ error: 'Could not update task' });
        } else {
            sendSqsMessage({ id, description });
            res.json({ id, description });
        }
    });
};

const deleteTask = (req, res) => {
    const { id } = req.params;

    const params = {
        TableName: TABLE_NAME,
        Key: { id },
    };

    dynamoDB.delete(params, (err) => {
        if (err) {
            res.status(500).json({ error: 'Could not delete task' });
        } else {
            res.status(204).end();
        }
    });
};

const uploadFile = (req, res) => {
    const { id } = req.params;
    const file = req.file;

    const uploadDir = path.join(__dirname, '../../uploads', id);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.originalname);

    fs.rename(file.path, filePath, (err) => {
        if (err) {
            res.status(500).json({ error: 'Could not upload file' });
        } else {        
            res.json({ message: 'File uploaded successfully', path: filePath });
        }
    });
};

const sendSqsMessage = (task) => {
    const params = {
        MessageBody: JSON.stringify(task),
        QueueUrl: process.env.SQS_QUEUE_URL,
    };

    sqs.sendMessage(params, (err) => {
        if (err) {
            console.error('Error sending SQS message:', err);
        } else {
            console.log('SQS message sent successfully');
        }
    });
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    uploadFile,
};
