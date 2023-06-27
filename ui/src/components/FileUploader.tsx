import axios from 'axios';
import React from 'react';
import '../styles/styles.css';

function FileUploader({ onUpload }) {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result;
      const rows = content?.split('\n');
      const data = rows.map((row) => {
        const [name, city, country, favoriteSport] = row.split(',');
        return { name, city, country, favoriteSport };
      });

      onUpload({ data, loading: true }); // Emit an event with the data and loading state

      const base64Data = btoa(content);

      try {
        await axios.post('http://localhost:3000/api/files', { content: base64Data });
        onUpload({ data, loading: false }); // Emit an event with the data and loading state
      } catch (error) {
        onUpload({ data, loading: false }); // Emit an event with the data and loading state
        console.error('Error uploading CSV:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="file-uploader">
      <input data-testid="file-input" type="file" onChange={handleFileChange} accept=".csv" />
    </div>
  );
}

export default FileUploader;