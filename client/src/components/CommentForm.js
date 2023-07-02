import { useFormik } from 'formik';
import React, { useState } from "react";
import { useKeycloak } from '@react-keycloak/web';

export default function CommentForm(props) {
  const { keycloak} = useKeycloak();
  const username = keycloak.tokenParsed?.preferred_username || '';
  const roles = keycloak.tokenParsed?.realm_access?.roles.filter(role => role === 'admin' || role === 'superszczupak' || role=== 'leszcz') || [];

  const [isAddingPost, setIsAddingPost] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: username,
      content: '',
      imageURL: '',
      ipAddress: '',
      roles: roles || '',
    },
    onSubmit: async (values) => {
      setIsAddingPost(true);
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      const ipAddress = data.ip;
      console.log(ipAddress);

      const formValues = {
        ...values,
        ipAddress: ipAddress,
        timestamp: new Date().toISOString(),
      };

      fetch(`http://localhost:5000/posts/${props.id}/comments`, {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setIsAddingPost(false);

      formik.resetForm({
        values: { username: username, content: '', imageURL: '', ipAddress: '', roles: roles || '' },
      });
    },
  });

  return (
    <div className="comment-form">
      <form className="comment-form-contents" onSubmit={formik.handleSubmit}>
        <textarea
          className='comment-textarea'
          value={formik.values.content}
          name="content"
          placeholder="Twój komentarz"
          onChange={formik.handleChange}
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <input
          className='comment-input'
          value={formik.values.imageURL}
          name="imageURL"
          placeholder="URL obrazka"
          onChange={formik.handleChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        {isAddingPost && (
          <p style={{ color: "orange" }}>Trwa dodawanie komentarza...</p>
        )}
        <button className="comment-submit-button" type="submit" disabled={isAddingPost}>
          Dodaj
        </button>
      </form>
    </div>
  );
}
