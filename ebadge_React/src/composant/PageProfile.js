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
import Api from '../utils/Api';
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
            background: "",
            user: null,
            levelAvatar: 23.90,
        };
    }

    async componentDidMount() {
        try{

            let response = await Api.get("/auth/current_user", {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            this.setState({user: response.data});
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {

        this.setState({ open: false });
    };

    handleModify = () => {

        if (isImage(this.state.user.backgroundImagePath)) {
            styleBackground = {
                backgroundImage: "url(" + this.state.user.backgroundImagePath + ")"
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
            let user = this.state.user;
            user.avatarImagePath = this.state.newUrl;
            this.setState({ user: user });
            this.setState({ openAvatar: false });
        } else {

        }
    };

    handleDeleteAvatar = () => {
        let user = this.state.user;
        user.avatarImagePath = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png";
        this.setState({ user: user });

        this.setState({ openAvatar: false });
    };

    render() {
        if(this.state.user == null){
            return <div></div>
        }
        console.log(this.state.user);
        return (
            <div className='background' style={styleBackground}>
                <div className='profil'>
                    <div>
                        <img className='avatar' src={this.state.user.avatarImagePath} />
                        <div className='imageProfile'>
                            <label htmlFor="avatar">
                                <img className='editImage' onClick={this.handleClickOpenAvatar} src='http://cdn.onlinewebfonts.com/svg/img_520583.png' alt="profil" title='image de profil' />
                            </label>
                        </div>
                    </div>
                    <div className='infosUser'>
                        <p><strong>{this.state.user.first_name} {this.state.user.last_name}</strong></p>
                        <p>{this.state.user.program_name}</p>
                        <div style={{width: "188px" }}>
                            <label>Compte privé :<input type="checkbox" className='checkbox' value={this.state.user.privacy}/></label>
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
                                    onChange={e => {
                                        let user = this.state.user;
                                        user.backgroundImagePath = e.target.value;
                                        this.setState({ user: user });
                                    }}
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
                            <div className="progressBarFill" style={{ width: (this.state.levelAvatar % 1) * 100 + "%" }}></div>
                        </div>
                    </div>
                </div>
                <div className='BadgeArray'>
                    {this.state.badges.length ? this.state.user.badges.map((badge, index) => {
                        return <BadgeComponent badge={badge} />
                    }) : <h1>Vous n'avez pas encore de badge.</h1>}
                </div>
            </div>
        );
    }
}