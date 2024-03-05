import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [itemId, setItemId] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'description') {
      setDescription(value);
    } else if (name === 'itemId') {
      setItemId(value);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post('http://localhost:8000/items/', { name, description });
      setMessage('Item created successfully');
      setResponse(JSON.stringify(response.data));
    } catch (error) {
      setMessage('Error creating item: ' + error.response.data.detail); // Display error message from backend
    }
  };

  const handleRead = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/items/${itemId}`);
      setMessage('Item read successfully');
      setResponse(JSON.stringify(response.data));
    } catch (error) {
      setMessage('Error reading item: ' + error.response.data.detail);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/items/${itemId}`, { name, description });
      setMessage('Item updated successfully');
      setResponse(JSON.stringify(response.data));
    } catch (error) {
      setMessage('Error updating item: ' + error.response.data.detail);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/items/${itemId}`);
      setMessage('Item deleted successfully');
      setResponse(JSON.stringify(response.data));
    } catch (error) {
      setMessage('Error deleting item: ' + error.response.data.detail);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" align="center" gutterBottom>
        CRUD App
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreate}
          >
            Create
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        <Grid item xs={12}>
          <TextField
            name="itemId"
            label="Item ID"
            variant="outlined"
            fullWidth
            value={itemId}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRead}
            fullWidth
          >
            Read
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            fullWidth
          >
            Update
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDelete}
            fullWidth
          >
            Delete
          </Button>
        </Grid>
      </Grid>
      {message && (
        <Typography variant="body1" color="primary" align="center" gutterBottom>
          {message}
        </Typography>
      )}
      {response && (
        <Typography variant="body1" color="textSecondary" align="center" gutterBottom>
          {response}
        </Typography>
      )}
    </Container>
  );
}

export default App;
