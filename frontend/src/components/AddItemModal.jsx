import React, { useState } from 'react';

function AddItemModal({ fields, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.type === 'number' ? '' : field.type === 'date' ? '' : '',
    }), {})
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

    const normalizedData = { ...formData };

    if ('UPC_prom' in normalizedData && normalizedData.UPC_prom === '') {
      normalizedData.UPC_prom = null;
    }

    if ('promotional_product' in normalizedData) {
      if (normalizedData.promotional_product === 'true') {
        normalizedData.promotional_product = 1;
      } else if (
        normalizedData.promotional_product === 'false' ||
        normalizedData.promotional_product === ''
      ) {
        normalizedData.promotional_product = 0;
      }
    }

    onSave(normalizedData);

    setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>Add Item</h2>
            <button
              type="button"
              onClick={() => {
                setFormData(
                  fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
                );
                onClose();
              }}
              className="close-button"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.name} className="modal-field">
                <label htmlFor={field.name}>{field.label}:</label>

                {field.type === 'date' ? (
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    readOnly={field.readOnly || false}
                    placeholder="Select date"
                  />
                ) : field.type === 'boolean' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : field.type === 'fk' && Array.isArray(field.options) ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label}`}
                  />
                )}
              </div>
            ))}
            <div className="modal-buttons">
              <button type="submit" className="save-button">
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData(
                    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
                  );
                  onClose();
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItemModal;