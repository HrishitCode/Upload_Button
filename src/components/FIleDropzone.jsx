
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileDropzone = () => {
  const onDrop = useCallback((acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('files', file);
    });

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.doc,.docx' });

  return (
    <div {...getRootProps()} style={{ border: '2px dashed black', padding: '20px', textAlign: 'center' }}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some DOC files here, or click to select files</p>
    </div>
  );
};

export default FileDropzone;
