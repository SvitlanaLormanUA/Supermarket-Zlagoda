import React, { useState, useEffect } from "react";

function EditItemModal({ isOpen, onClose, onSave, fields, items, itemKey = "name", itemIdKey = "id" }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState(null);

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
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Item</h2>

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
                                    <td>{item[itemKey]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {formData && (
                    <form onSubmit={handleSubmit}>
                        {fields.map((field) => (
                            <div key={field.name} className="modal-field">
                                <label>{field.label}</label>
                                <input
                                    type="text"
                                    value={formData[field.name] || ""}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                />
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
    );
}

export default EditItemModal;
