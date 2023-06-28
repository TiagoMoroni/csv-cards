import axios from 'axios';
import React from 'react';
import '../styles/styles.css';

function FileUploader({ onUpload, onError }) {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result;
      if(content == ""){
        onError("Empty .csv file")
        return;
      }
      const rows = content?.split('\n');
      const data = rows.map((row) => {
        const [name, city, country, favoriteSport] = row.split(',');
        return { name, city, country, favoriteSport };
      });

      onUpload({ data, loading: true });

      const base64Data = btoa(content);

      try {
        await axios.post('http://localhost:3000/api/files', { content: base64Data });
        onUpload({ data, loading: false });
      } catch (error: any) {
        onError(error.response.data.error)
        onUpload({ data: [], loading: false });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="file-uploader">
      <input data-testid="file-input" id='file' className='file-input' type="file" onChange={handleFileChange} accept=".csv" title='asdsa' />
      <div className='file-input-label'>
        <label htmlFor="file">Select .csv File</label>
      </div>
    </div>
  );
}

export default FileUploader;