import React, { useState, useEffect } from "react";

function DeleteItemModal({
  isOpen,
  onClose,
  items = [],
  itemKey = "name",
  itemIdKey = "id",
  onDelete
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedItems([]);
    }
  }, [isOpen]);

  useEffect(() => {
  }, [items]);

  if (!isOpen) return null;

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (selectedItems.length > 0) {
      onDelete(selectedItems);
    }
    setSelectedItems([]);
    onClose();
  };

  return (
    <div className="modal-container">
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>Delete Item</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>

          {items.length > 0 ? (
            <ul className="item-list">
              {items.map((item) => {
                const itemId = item[itemIdKey];
                const itemLabel = item[itemKey];

                return (
                  <li key={itemId}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(itemId)}
                        onChange={() => handleCheckboxChange(itemId)}
                      />
                      {itemLabel}
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No items available for deletion.</p>
          )}

          <div className="modal-buttons">
            <button
              type="submit"
              className="delete-btn"
              onClick={handleDelete}
              disabled={selectedItems.length === 0}
            >
              Delete
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteItemModal;
