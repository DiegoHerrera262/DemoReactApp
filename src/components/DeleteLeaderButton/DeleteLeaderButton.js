import React, { useState, useEffect } from "react";
import { deleteLeaderById } from "../../endpoint/zoneLeaders.methods";
import buttonStyle from "./DeleteLeaderButton.module.css";
import Modal from "react-modal";
Modal.setAppElement("body");

const DeleteLeaderButton = (props) => {
  const { id, handleElimination } = props;
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (deleted) {
      console.log("Lider borrado.");
      handleElimination(id);
      setDeleted(false);
    }
  }, [deleted, handleElimination, id]);

  const handleValidateDelete = () => {
    setConfirmDeleteModal(true);
  };

  const handleClick = async () => {
    setConfirmDeleteModal(false);
    const res = await deleteLeaderById(id);
    console.log(res.message);
    setDeleted(true);
  };

  return (
    <>
      <button
        onClick={handleValidateDelete}
        className={buttonStyle["delete-button"]}
      >
        Eliminar
      </button>
      <Modal
        isOpen={confirmDeleteModal}
        onRequestClose={() => setConfirmDeleteModal(false)}
        className={buttonStyle["Modal"]}
        overlayClassName={buttonStyle["Overlay"]}
      >
        <p align="center">Confirme eliminación del líder.</p>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleClick}
            className={buttonStyle["delete-confirm-button"]}
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteLeaderButton;
