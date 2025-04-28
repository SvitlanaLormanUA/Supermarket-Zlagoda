import React, { useState, useEffect } from "react";

function EditItemModal({ isOpen, onClose, onSave, fields, items, itemKey = "name", itemIdKey = "id" }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setSelectedItem(null);
            setFormData(null);
        }
    }, [isOpen]);

    useEffect(() => {
        setFormData(selectedItem);
    }, [selectedItem]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-container">
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <h2>Edit Item</h2>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
                                onClose();
                            }}
                            className="close-button"
                        >
                            ×
                        </button>
                    </div>
                    <div className="edit-table-container">
                        <table className="item-table">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>{itemKey}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item[itemIdKey]} onClick={() => setSelectedItem(item)}>
                                        <td>
                                            {selectedItem?.[itemIdKey] === item[itemIdKey] ? "✔" : ""}
                                        </td>
                                        <td>{typeof itemKey === "function" ? itemKey(item) : item[itemKey]}</td>                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {formData && (
                        <form onSubmit={handleSubmit}>
                            {fields.map((field) => (
                                <div key={field.name} className="modal-field">
                                    <label>{field.label}</label>

                                    {field.readOnly ? (
                                        <input
                                            type="text"
                                            value={formData[field.name] || ""}
                                            disabled={true}
                                        />
                                    ) : field.type === 'boolean' ? (
                                        <select
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    ) : field.type === 'fk' && Array.isArray(field.options) ? (
                                        <select
                                            name={field.name}
                                            value={formData[field.name] || ""}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
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
                                            type="text"
                                            value={formData[field.name] || ""}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            placeholder={`Enter ${field.label}`}
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="modal-buttons">
                                <button type="submit" className="save-button">Save</button>
                                <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditItemModal;
