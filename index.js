const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection String
const mongoURI = "mongodb+srv://shivanshsukhijaengineer:1qQ2pX26pTqhJvZo@cluster0.ejlncka.mongodb.net/todoApp?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema and Model
const todoSchema = new mongoose.Schema({
    text: String
});

const Todo = mongoose.model('Todo', todoSchema);

// Get all todos
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

// Add a new todo
app.post('/todos', async (req, res) => {
    const { text } = req.body;
    if (text) {
        const newTodo = new Todo({ text });
        await newTodo.save();
        res.json(newTodo);
    } else {
        res.status(400).json({ error: 'Text is required' });
    }
});

// Delete a todo by ID
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Todo deleted' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
