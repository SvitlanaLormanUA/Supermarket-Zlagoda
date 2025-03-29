import React, { useState } from "react";
import AddItemModal from "./AddItemModal";

function ControlButtons({ onAdd, onEdit, onDelete, modalFields }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="action-buttons">
      <button className="action-button add-button" onClick={openModal}>
        Add
      </button>

      <button className="action-button edit-button" onClick={onEdit} >
        Edit
      </button>
      
      <button className="action-button delete-button" onClick={onDelete}>
        Delete
      </button>

      {modalFields && (
        <AddItemModal
          fields={modalFields}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={(data) => {
            onAdd(data); 
            closeModal();
          }}
        />
      )}
    </div>
  );
}

export default ControlButtons;
