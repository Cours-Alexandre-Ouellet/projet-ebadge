import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import './UserAdminPopup.css';



const UserAdminPopup = ({ isOpen, selectedAdmin, handleClose, deleteAdmin, canDelete }) => {
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
        
        <Button onClick={handleClose} variant="outlined">Fermer</Button>
        {canDelete && (
          <Button onClick={() => deleteAdmin(selectedAdmin.id)} className="admin-delete-btn" variant="contained">
            Supprimer
          </Button>
        )}
      </DialogActions>

    
    </Dialog>
  );
};

export default UserAdminPopup;
