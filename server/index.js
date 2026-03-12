import express from 'express';
import cors from 'cors';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const sampleData = require('./data/samplePlots.json');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data store (in-memory for MVP)
let projectData = { ...sampleData };

// API Routes
app.get('/api/project', (req, res) => {
    res.json(projectData);
});

app.post('/api/plots/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const plotIndex = projectData.plots.findIndex(p => p.id === parseInt(id));

    if (plotIndex > -1) {
        projectData.plots[plotIndex].status = status;
        res.json(projectData.plots[plotIndex]);
    } else {
        res.status(404).json({ error: 'Plot not found' });
    }
});

// PDF Upload Mock
app.post('/api/upload', (req, res) => {
    // In a real app, this would process the PDF
    res.json({ message: 'PDF uploaded successfully', projectId: 1 });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
