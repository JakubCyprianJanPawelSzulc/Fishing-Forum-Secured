import React, { useState } from "react";
import { useFormik } from 'formik';
import { useKeycloak } from '@react-keycloak/web';

export default function PostForm() {
  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed?.preferred_username || '';
  const roles = keycloak.tokenParsed?.realm_access?.roles.filter(role => role === 'admin' || role === 'superszczupak' || role === 'leszcz') || [];

  const [isAddingPost, setIsAddingPost] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: username,
      title: '',
      content: '',
      ipAddress: '',
      imageURL: '',
      roles: roles || ''
    },
    onSubmit: async (values) => {
      setIsAddingPost(true);
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ipAddress = data.ip;

        const formValues = {
          ...values,
          ipAddress: ipAddress,
          timestamp: new Date().toISOString(),
        };

        const requestOptions = {
          method: 'POST',
          body: JSON.stringify(formValues),
          headers: {
            'Authorization': `Bearer ${keycloak.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        };
        await fetch('http://localhost:5000/posts', requestOptions);

        setIsAddingPost(false);

        formik.resetForm({
          values: { username: username, title: '', content: '', imageURL: '', roles: roles || '' },
        });
      } catch (error) {
        console.error('Error:', error);
        setIsAddingPost(false);
      }
    },
  });

  return (
    <div className="post-form">
      <form className="post-form-contents" onSubmit={formik.handleSubmit}>
        <input
          className="post-form-input"
          value={formik.values.title}
          name="title"
          placeholder="tytuł"
          onChange={formik.handleChange}
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <textarea
          className="post-form-textarea"
          value={formik.values.content}
          name="content"
          placeholder="twój post"
          onChange={formik.handleChange}
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <input
          className="post-form-input"
          value={formik.values.imageURL}
          name="imageURL"
          placeholder="URL zdjęcia"
          onChange={formik.handleChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        {isAddingPost && (
          <p style={{ color: "orange" }}>Trwa dodawanie posta...</p>
        )}
        <button className="post-submit-button" type="submit" disabled={isAddingPost}>
          Dodaj
        </button>
      </form>
    </div>
  );
}
