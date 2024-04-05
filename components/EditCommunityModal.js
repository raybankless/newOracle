  import React, { useState } from 'react';
  import styles from '../styles/EditCommunityModal.module.css';
  
  const EditCommunityModal = ({ community, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      name: community.name || '',
      image: community.image || '',
      description: community.description || '',
      webLink: community.webLink || '',
    });
  
    // Correctly used handleChange function to update state based on form input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(formData); // Calls the onUpdate function passed as prop with the updated form data
      onClose(); // Calls the onClose function to close the modal
    };
  
    return (
      <div className={styles.modalBackdrop} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h2>Edit Community</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Community Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="webLink"
              placeholder="Website Link"
              value={formData.webLink}
              onChange={handleChange}
            />
            <div>
              <button type="submit">Save</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default EditCommunityModal;
  