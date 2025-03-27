import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import Api from '../../../../utils/Api';
import "./UserAdminPopup.css";

const ChangePasswordPopup = ({ isOpen, handleClose, adminId }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fonction pour réinitialiser les états
  const resetState = () => {
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  // Gère la soumission du mot de passe
  const handleSubmit = () => {
    // Vérification que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Vérification de la longueur minimale du mot de passe
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    Api.post(`/user/admin/${adminId}/change-password`, { password })
      .then(() => {
        setSuccess("Mot de passe mis à jour !");
        setTimeout(() => {
          resetState(); // Réinitialisation des champs et messages
          handleClose();
        }, 2000); // Fermer la popup après 2s
      })
      .catch(() => setError("Erreur lors du changement de mot de passe."));
  };

  // Réinitialise les champs lorsque la popup est fermée
  const handleCloseReset = () => {
    resetState();
    handleClose(); // Appeler la fonction de fermeture
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseReset}>
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
        {error && <p className="error-text">{error}</p>} {/* Affichage de l'erreur */}
        {success && <p className="success-text">{success}</p>} {/* Affichage du succès */}
      </DialogContent>
      <DialogActions className="admin-actions">
        <Button onClick={handleCloseReset} variant="outlined">Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Modifier</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordPopup;
