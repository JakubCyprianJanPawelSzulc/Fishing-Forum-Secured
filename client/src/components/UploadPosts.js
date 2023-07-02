import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

export default function UploadPosts() {
  const [file, setFile] = useState(null);
  const { keycloak } = useKeycloak();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
      alert('Proszę wybrać plik JSON.');
    }
  };

  const handleUpload = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const postsArray = JSON.parse(e.target.result);
      const postsDocuments = postsArray.posts.map((post) => {
        return {
          username: post.username,
          title: post.title,
          content: post.content,
          ipAddress: post.ipAddress,
          imageURL: post.imageURL,
          timestamp: post.timestamp,
          roles: post.roles,
          comments: post.comments.map((comment) => {
            return {
              username: comment.username,
              content: comment.content,
              ipAddress: comment.ipAddress,
              imageURL: comment.imageURL,
              timestamp: comment.timestamp,
              roles: comment.roles,
            };
          }),
        };
      });
      fetch('http://localhost:5000/posts/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postsDocuments),
      });
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
      {file && (
        <button onClick={handleUpload}>
          Upload
        </button>
      )}
    </div>
  );
}
