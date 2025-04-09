import React from "react";

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Button, DialogActions } from "@mui/material";
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

export default function ConfirmationPopup({ isOpen, onCancel, onConfirm, message, cancelText = "Annuler", confirmText = "Confirmer" }) {
    return (
        <Dialog open={isOpen ?? false} onClose={onCancel}>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Confirmation
                {onCancel ? (
                    <IconButton
                        aria-label="cancel"
                        onClick={onCancel}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
            <DialogContent className={"confirmation-popup"}>
                {message}
            </DialogContent>
            <DialogActions>
                <Button className={"mt-2"} onClick={onCancel}>{cancelText}</Button>
                <Button variant="outlined" className={"mt-2"} onClick={onConfirm}>{confirmText}</Button>
            </DialogActions>
        </Dialog >
    );
}