import { Alert, Snackbar } from "@mui/material";

/**
 * Affiche un message d'information qui disparait
 * 
 * @param {*} onClose fonction qui gère ce qui doit être fait après la fermeture du popup.
 * @param {*} openPopup UseState qui gère la fermeture.
 * @param {*} message Message à affichier
 * @param {*} severity Importance du message. Seule exemple possible : success, info, warning, error
 * @returns Un message d'information
 * @author Vincent Houle
 */
export default function InformationPopup({onClose, isOpen, message, severity}) {
    return (
        <Snackbar onClose={onClose} open={isOpen} autoHideDuration={10000}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }} md={{ minWidth: '300px' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}