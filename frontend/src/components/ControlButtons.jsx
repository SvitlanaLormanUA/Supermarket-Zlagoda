import React, { useState } from "react";
import AddItemModal from "./AddItemModal";
import DeleteItemModal from "./DeleteItemModal";

function ControlButtons({
  onAdd,
  onEdit,
  onDelete,
  modalFields,
  deleteItems,
  itemKey = "name",
  itemIdKey = "id"
}) {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div className="action-buttons">
      <button className="action-button add-button" onClick={() => setAddModalOpen(true)}>
        Add
      </button>

      <button className="action-button edit-button" onClick={onEdit}>
        Edit
      </button>

      <button className="action-button delete-button" onClick={() => setDeleteModalOpen(true)}>
        Delete
      </button>


      <AddItemModal
        fields={modalFields}
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={(data) => {
          onAdd(data);
          setAddModalOpen(false);
        }}
      />

      <DeleteItemModal
        items={deleteItems}
        itemKey={itemKey}
        itemIdKey={itemIdKey}
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={(selectedIds) => {
          onDelete(selectedIds);
          setDeleteModalOpen(false);
        }}
      />

    </div>
  );
}

export default ControlButtons;
