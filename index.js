const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan'); // For logging requests
const helmet = require('helmet'); // For security enhancements

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logs requests to the console
app.use(helmet()); // Adds various HTTP headers to secure the app

// MongoDB Connection String
const mongoURI = "mongodb+srv://shivanshsukhijaengineer:1qQ2pX26pTqhJvZo@cluster0.ejlncka.mongodb.net/todoApp?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit if connection fails
    });

// Mongoose Schema and Model
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// Add a new todo
app.post('/todos', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const newTodo = new Todo({ text });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error saving todo:', error);
        res.status(500).json({ error: 'Failed to save todo' });
    }
});

// Delete a todo by ID
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Todo ID' });
        }

        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
