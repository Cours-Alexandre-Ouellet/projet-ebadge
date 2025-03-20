import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import './UserAdminPopup.css';
import ChangePasswordPopup from './ChangePasswordPopup';


const UserAdminPopup = ({ isOpen, selectedAdmin, handleClose, deleteAdmin, canDelete }) => {
  const [openPasswordPopup, setOpenPasswordPopup] = useState(false);

  if (!selectedAdmin) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose}>
        
      <DialogTitle>Gestion de l'administrateur</DialogTitle>
      
      <DialogContent className="admin-popup">
        <div className="admin-info">
          <p><strong>Prénom :</strong> {selectedAdmin.first_name}</p>
          <p><strong>Nom :</strong> {selectedAdmin.last_name}</p>
        </div>
      </DialogContent>
      <DialogActions className="admin-actions">
        <Button onClick={() => setOpenPasswordPopup(true)} variant="outlined">
          Modifier le mot de passe
        </Button>
        <Button onClick={handleClose} variant="outlined">Fermer</Button>
        {canDelete && (
          <Button onClick={() => deleteAdmin(selectedAdmin.id)} className="admin-delete-btn" variant="contained">
            Supprimer
          </Button>
        )}
      </DialogActions>

      {/* Popup de changement de mot de passe */}
      <ChangePasswordPopup 
        isOpen={openPasswordPopup} 
        handleClose={() => setOpenPasswordPopup(false)}
        adminId={selectedAdmin.id}
      />
    </Dialog>
  );
};

export default UserAdminPopup;
