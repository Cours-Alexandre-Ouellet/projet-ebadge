import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import Api from '../../../../utils/Api';
import "./UserAdminPopup.css";

const ChangePasswordPopup = ({ isOpen, handleClose, adminId }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    Api.post(`/user/admin/${adminId}/change-password`, { password })
      .then(() => {
        setSuccess("Mot de passe mis à jour !");
        setTimeout(handleClose, 2000); // Fermer la popup après 2s
      })
      .catch(() => setError("Erreur lors du changement de mot de passe."));
  };

  
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Changer le mot de passe</DialogTitle>
      <DialogContent className="admin-popup">
        <TextField
          label="Nouveau mot de passe"
          type="password"
          fullWidth
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirmer le mot de passe"
          type="password"
          fullWidth
          margin="dense"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </DialogContent>
      <DialogActions className="admin-actions">
        <Button onClick={handleClose} variant="outlined">Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Modifier</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordPopup;
