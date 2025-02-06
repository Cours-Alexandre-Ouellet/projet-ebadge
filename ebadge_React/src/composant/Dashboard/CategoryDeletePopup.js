import React from "react";
import './CategoryDeletePopup.css';
import Api from '../../utils/Api';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Button } from "@mui/material";
import { Dialog, DialogContent, DialogTitle, DialogContentText } from '@mui/material';

class CategoryDeleteAction extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        Api.delete('/category/' + this.props.selectedCategory.id)
            .then(res => {
                this.props.onClose();
                this.props.deleteCategory(this.props.selectedCategory);
            })
            .catch(err => {
                this.props.errorCategory('Une erreur est survenue');
                console.log(err);
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
                <DialogContent className={"delete-category-popup"}>
                    <DialogContentText align="center">
                        <b>Veuillez confirmer la suppression de la catégorie : {this.props.selectedCategory ? this.props.selectedCategory.title : "Inconnue"}</b><br/>
                        <br/>
                        Détails :<br/>
                        Tous les badges ayant cette catégorie seront dégradés.<br/>
                        <br />
                        <Button variant="outlined" color="error" className={"mt-2"} onClick={this.handleSubmit} >Supprimer la catégorie</Button>
                    </DialogContentText>
                </DialogContent>
            </Dialog >
        );
    }
}

export default (CategoryDeleteAction);
