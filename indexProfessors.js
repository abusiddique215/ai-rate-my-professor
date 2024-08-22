const fetch = require('node-fetch');

async function indexProfessors() {
  try {
    const response = await fetch('http://localhost:3000/api/index-professors', {
      method: 'POST',
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error indexing professors:', error);
  }
}

indexProfessors();