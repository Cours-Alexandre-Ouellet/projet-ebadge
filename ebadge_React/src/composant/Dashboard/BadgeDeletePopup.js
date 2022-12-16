import React from "react";
import './BadgeDeletePopup.css';
import Api from '../../utils/Api';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { FormControl, Button } from "@mui/material";
import { Dialog, DialogContent, DialogTitle, DialogContentText } from '@mui/material';

class BadgeDeleteAction extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        Api.delete('/badge/' + this.props.selectedBadge.id)
            .then(res => {
                this.props.onClose();
            });
    }

    render() {
        return (

            <Dialog open={this.props.isOpen ?? false} onClose={this.props.onClose}>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    Confirmation
                    {this.props.onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={this.props.onClose}
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
                <DialogContent className={"delete-badge-popup"}>
                    <DialogContentText>
                        <form>
                            <FormControl fullWidth>
                                <p>
                                    <b>Veuillez confirmer la suppression du badge : <span>{this.props.selectedBadge ? this.props.selectedBadge.title : "Inconnue"}</span></b>
                                </p>
                                <p>
                                    Détails :
                                    Tous les utilisateurs ayant ce badge seront dégradés.
                                </p>
                                <br />
                            </FormControl>
                            <FormControl fullWidth>
                                <Button variant="outlined" color="error" className={"mt-2"} onClick={this.handleSubmit} >Supprimer le badge</Button>
                            </FormControl>
                        </form>
                    </DialogContentText>
                </DialogContent>
            </Dialog >
        );
    }
}

export default (BadgeDeleteAction);
