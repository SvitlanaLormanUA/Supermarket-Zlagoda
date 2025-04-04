import React, { useState } from 'react';

function AddItemModal({ fields, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Форма відправлена, дані:", formData);
    onSave(formData);
    setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="modal-field">
              <label htmlFor={field.name}>{field.label}:</label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label}`}
              />
            </div>
          ))}
          <div className="modal-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;
