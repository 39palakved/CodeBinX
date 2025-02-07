const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
main().catch(err => console.error('MongoDB Connection Error:', err));
async function main() {
  await mongoose.connect('mongodb+srv://porwalpalak10:Sweety123456789@codecluster.qn0or.mongodb.net/?retryWrites=true&w=majority&appName=CodeCluster', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ DB Connected');
}

// ✅ Define Schema & Model
const NoteSchema = new mongoose.Schema({
  documentId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Notes = mongoose.model('Notes', NoteSchema);

// ✅ Start Server
app.listen(8080, () => console.log('🚀 Server started on port 8080'));

// ✅ Get All Notes
app.get('/getdata', async (req, res) => {
  try {
    const notes = await Notes.find();
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Add a New Note
app.post('/add', async (req, res) => {
  try {
    const { title, content } = req.body;
    const documentId = new mongoose.Types.ObjectId().toString(); // Generate unique ID

    const newNote = new Notes({ documentId, title, content });
    await newNote.save();

    res.status(201).json(newNote);
  } catch (err) {
    console.error('Error adding note:', err);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// ✅ Update a Note
app.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedNote = await Notes.findOneAndUpdate(
      { documentId: id },
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(updatedNote);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// ✅ Delete a Note
// ✅ Fix Delete Route in Backend
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNote = await Notes.findOneAndDelete({ documentId: id }); // Find by documentId
    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully', deletedNote });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: 'Server error' });
  }
});
