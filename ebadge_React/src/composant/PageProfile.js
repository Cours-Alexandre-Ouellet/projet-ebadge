import * as React from 'react';
import './PageProfile.css';
import '@mui/material';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import BadgeComponent from './BadgeComponent';
import Alert from '@mui/material/Alert';

var background = "../background.png";
var styleBackground = {
    backgroundImage: "url(../background.png))"
};

function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}


export default class PageProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            newUrl: "",
            openAvatar: false,
            avatarImage: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png",
            background: "",
            levelAvatar: 23.90,
            Badge: [
                {
                    title: "Badge 1",
                    description: "Description du badge 1",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },  
                {
                    title: "Badge 2",
                    description: "Description du badge 2",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 3",
                    description: "Description du badge 3",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 4",
                    description: "Description du badge 4",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 5",
                    description: "Description du badge 5",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 6",
                    description: "Description du badge 6",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 7",
                    description: "Description du badge 7",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },/*
                {
                    title: "Badge 8",
                    description: "Description du badge 8",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 9",
                    description: "Description du badge 9",
                    imagePath: "https://cdn.pixabay.com/photo/2015/10/01/17/17/car-967387__480.png",
                    pourcentage: "50%",
                    color: "#0000FF"
                },
                {
                    title: "Badge 1",
                    description: "Description du badge 1",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 2",
                    description: "Description du badge 2",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 3",
                    description: "Description du badge 3",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 4",
                    description: "Description du badge 4",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 5",
                    description: "Description du badge 5",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 6",
                    description: "Description du badge 6",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 7",
                    description: "Description du badge 7",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 8",
                    description: "Description du badge 8",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 9",
                    description: "Description du badge 9",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 1",
                    description: "Description du badge 1",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 2",
                    description: "Description du badge 2",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 3",
                    description: "Description du badge 3",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 4",
                    description: "Description du badge 4",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 5",
                    description: "Description du badge 5",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 6",
                    description: "Description du badge 6",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 7",
                    description: "Description du badge 7",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 8",
                    description: "Description du badge 8",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                },
                {
                    title: "Badge 9",
                    description: "Description du badge 9",
                    imagePath: "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
                    pourcentage: "50%"
                }*/
            ],
        };
    }


    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {

        this.setState({ open: false });
    };

    handleModify = () => {

        if (isImage(this.state.background)) {
            styleBackground = {
                backgroundImage: "url(" + this.state.background + ")"
            };
            this.setState({ open: false });
        } else {
        }
    };
    handleDelete = () => {
        styleBackground = {
            backgroundImage: ""
        };

        this.setState({ open: false });
    };

    handleClickOpenAvatar = () => {
        this.setState({ openAvatar: true });
    };

    handleCloseAvatar = () => {
        this.setState({ openAvatar: false });
    };

    handleModifyAvatar = () => {

        if (isImage(this.state.newUrl)) {
            this.setState({ avatarImage: this.state.newUrl });
            this.setState({ openAvatar: false });
        } else {

        }
    };

    handleDeleteAvatar = () => {
        this.setState({ avatarImage: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png" });
    
        this.setState({ openAvatar: false });
    };

    render() {
        return (
            <div className='background' style={styleBackground}>
                <div className='profil'>
                    <div>
                        <img className='avatar' src={this.state.avatarImage} />
                        <div className='imageProfile'>
                            <label htmlFor="avatar">
                                <img className='editImage' onClick={this.handleClickOpenAvatar} src='http://cdn.onlinewebfonts.com/svg/img_520583.png' alt="profil" title='image de profil' />
                            </label>
                        </div>
                    </div>
                    <div className='infosUser'>
                        <p><strong>Nom d'utilisateur</strong></p>
                        <p># de groupe</p>
                        <div style={{width: "188px" }}>
                            <label>Compte privé :<input type="checkbox" className='checkbox' /></label>
                        </div>
                        <Button variant="contained" onClick={this.handleClickOpen} className='backgroundButton'>Modifier l'arrière plan</Button>
                        <Dialog open={this.state.open} onClose={this.handleClose}>
                            <DialogTitle>Modifier l'arrière plan</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Pour changer l'arrière plan, veuillez entrer l'URL de l'image.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="URL"
                                    type="url"
                                    fullWidth
                                    variant="standard"
                                    onChange={e => this.setState({ background: e.target.value })}
                                />
                                <br />
                                <br />
                                <br />
                                <DialogContentText>
                                    Vous pouvez également importé une image.
                                </DialogContentText>
                                <br />
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Importer une image
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        hidden
                                    />
                                </Button>
                                <div className="hiddenAlert">
                                    <Alert variant="filled" severity="error" >
                                        L'url de l'image n'est pas valide.
                                    </Alert>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose}>Cancel</Button>
                                <Button onClick={this.handleDelete}>Supprimer</Button>
                                <Button onClick={this.handleModify}>Modifier</Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog open={this.state.openAvatar} onClose={this.handleCloseAvatar}>
                            <DialogTitle>Modifier l'avatar</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Pour changer l'avatar, veuillez entrer l'URL de l'image.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="URL"
                                    type="url"
                                    fullWidth
                                    variant="standard"
                                    onChange={e => this.setState({ newUrl: e.target.value })}
                                />
                                <br />
                                <br />
                                <br />
                                <DialogContentText>
                                    Vous pouvez également importé une image.
                                </DialogContentText>
                                <br />
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Importer une image
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        hidden
                                    />
                                </Button>   
                                <div className="hiddenAlert">
                                    <Alert variant="filled" severity="error" >
                                        L'url de l'image n'est pas valide.
                                    </Alert>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleCloseAvatar}>Cancel</Button>
                                <Button onClick={this.handleDeleteAvatar}>Supprimer</Button>
                                <Button onClick={this.handleModifyAvatar}>Modifier</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div className="infosLevel">
                        <p className='progressLevel'>Level : {Math.floor(this.state.levelAvatar)}</p>
                        <div className="progressBar">
                            <div className="progressBarFill" style={{width: (this.state.levelAvatar % 1) * 100 + "%" }}></div>
                        </div>
                    </div>
                </div>
                <div className='BadgeArray'>
                    {this.state.Badge.length ? this.state.Badge.map((leBadge, index) => {
                        return <BadgeComponent badge={leBadge} />
                    }) : <h1>Vous n'avez pas encore de badge.</h1>}
                </div>
            </div>
        );
    }
}