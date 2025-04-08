import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

/**
 * Affiche un popup de confirmation
 * @param {*} handleClose Ferme le popup 
 * @param {*} isOpen Ouvre le popup
 * @param {*} handleSubmit Gère la modification de mot de passe
 * @returns un dialog de confirmation
 * @author Vincent Houle
 */
export default function UserModifyPasswordPopup({ handleClose, handleSubmit, isOpen }) {
    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>Attention</DialogTitle>
            <DialogContent>
                <Typography>Êtes-vous sûr de vouloir changer de mot de passe ?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined">Non</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Oui</Button>
            </DialogActions>
        </Dialog>
    );
}