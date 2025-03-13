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
import Alert from '@mui/material/Alert';
import Api from '../utils/Api';
import Loading from './Loading/LoadingComponent';
import BadgeList from './PageProfil/BadgeList';
import { Check } from '@mui/icons-material';
import ConfirmationPopup from './Dashboard/Popups/ConfirmationPopup/ConfirmationPopup';
import { TRANSITION_DURATION } from '../theme';
import PoliciesHelper from '../policies/PoliciesHelper';
import { RoleIds } from '../policies/Role';

/**
 * fonction qui vérifie si l'url est une image
 * @param {*} url 
 * @returns boolean 
 */
function isImage(url) {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(url);
}

export default class PageProfile extends React.Component {

    constructor(props) {
        super(props);

        this.policiesHelper = new PoliciesHelper();

        this.state = {
            openBackground: false,
            openConfirmationPopup: false,
            confirmPrivacyMessage: "",
            openAvatar: false,
            avatarUrlField: "",
            avatarImageFile: null,
            user: {},
            backgroundUrlField: "",
            backgroundImageFile: null,
            levelAvatar: 23.90,
        };
        this.updatePrivacyMessage = this.updatePrivacyMessage.bind(this);
    }

    /**
     * fonction qui récupère les données de l'utilisateur connecté
     */
    componentDidMount() {
        Api.get("/auth/current_user").then((response) => {
            if (response.data.avatarImagePath == null) {
                console.log("avatar null");
                response.data.avatarImagePath = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png";
            }
            if (response.data.backgroundImagePath == null) {
                console.log("background null");
                response.data.backgroundImagePath = "./background.png";
            }
            this.setState({ user: response.data });
            this.updatePrivacyMessage();
        }).catch((error) => {
            console.error(error);
        });
    }

    /**
     * Fonction qui met à jour le message de confirmation de modification de l'anonymat
     */
    updatePrivacyMessage() {
        this.setState({ confirmPrivacyMessage: `Voulez-vous vraiment rendre votre compte ${this.state.user.privacy ? 'public' : 'privé'} ?` });
    }

    /**
     * Fonction qui gère l'ouverture de la fenêtre de modification de l'anonymat
     */
    handleOpenPrivacyConfirmationPopup = () => {
        this.setState({ openConfirmationPopup: true });
    };

    /**
     * Fonction qui gère la fermeture de la fenêtre de modification de l'anonymat
     */
    handleClosePrivacyConfirmationPopup = () => {
        this.setState({ openConfirmationPopup: false });
    };

    /**
     * Fonction qui valide et effectue le changement de l'anonymat
     */
    handleConfirmPrivacyChange = () => {
        const isAnonymous = !this.state.user.privacy;
        this.setState({ openConfirmationPopup: false, user: { ...this.state.user, privacy: isAnonymous } });

        setTimeout(this.updatePrivacyMessage, TRANSITION_DURATION);

        Api.post('/user/edit-privacy', {
            privacy: isAnonymous
        }).catch((error) => {
            console.error(error);
        });
    }

    /**
     * Fonction qui gère l'ouverture de la fenêtre de modification de l'anonymat
     */
    handleOpenPrivacyConfirmationPopup = () => {
        this.setState({ openConfirmationPopup: true });
    };

    /**
     * fonction qui gère l'ouverture de la fenêtre de modification du fond d'écran
     */
    handleClickOpen = () => {
        this.setState({ openBackground: true });
    };

    /**
     * fonction qui gère la fermeture de la fenêtre de modification du fond d'écran
     */
    handleClose = () => {
        this.setState({ openBackground: false });
    };

    /**
     * fonction qui gère la modification du fond d'écran
     */
    handleModify = () => {
        if (this.state.backgroundImageFile != null) {
            let formData = new FormData();
            formData.append('background', this.state.backgroundImageFile);

            Api.post('/user/edit-background', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                this.setState({ openBackground: false, user: { ...this.state.user, backgroundImagePath: response.data.url } });
            }).catch((error) => {
                console.error(error);
            });
            this.setState({ backgroundImageFile: null });
        } else if (isImage(this.state.backgroundUrlField)) {
            this.setState({ openBackground: false, user: { ...this.user, backgroundImagePath: this.state.backgroundUrlField } });

            Api.post('/user/edit-background', {
                backgroundUrl: this.state.user.backgroundImagePath
            }).catch((error) => {
                console.error(error);
            });
        }
        this.setState({ backgroundImageFile: null });
    };

    /**
     * fonction qui gère la suppression du fond d'écran 
     */
    handleDelete = () => {
        let user = this.state.user;
        user.backgroundImagePath = "./background.png";

        this.setState({
            user: user,
            openBackground: false
        });
    };

    /**
     * fonction qui gère la modification de l'url de l'avatar
     */
    handleClickOpenAvatar = () => {
        this.setState({ openAvatar: true });
    };

    /**
     * fonction qui gère la fermeture de la fenêtre de modification de l'avatar
     */
    handleCloseAvatar = () => {
        this.setState({ openAvatar: false });
    };

    /**
     * fonction qui gère la modification de l'avatar
     */
    handleModifyAvatar = () => {
        if (this.state.avatarImageFile != null) {
            let formData = new FormData();
            formData.append('avatar', this.state.avatarImageFile);

            Api.post('/user/edit-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                this.state.user.avatarImagePath = response.data.url;
                this.setState({ openAvatar: false });
            }).catch((error) => {
                console.error(error);
            });

        } else if (isImage(this.state.avatarUrlField)) {
            this.state.user.avatarImagePath = this.state.avatarUrlField;
            this.setState({ openAvatar: false });

            Api.post('/user/edit-avatar', {
                avatarUrl: this.state.user.avatarImagePath
            }).catch((error) => {
                console.error(error);
            });
        }
        this.setState({ avatarImageFile: null });
    };

    /**
     * fonction qui gère la suppression de l'avatar
     */
    handleDeleteAvatar = () => {
        let user = this.state.user;
        user.avatarImagePath = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png";
        this.setState({ user: user, openAvatar: false });
    };

    /**
     * Ouvre la fenêtre de confirmation de modification de l'anonymat
     */
    handleOpenPrivacy = (e) => {
        this.setState({ openConfirmationPopup: true });
    }

    /**
     * fonction qui gère la modification du nom
     */
    badgePercentage = () => {
        Api.get("/badge")
            .then((response) => {
                this.setState({ badges: response.data });
            }).catch((error) => {
                console.error(error);
            });
    }


    render() {
        if (this.state.user == null || !this.state.user.id) {
            return <Loading></Loading>
        }
        return (
            <div className='background' style={{ backgroundImage: `url(${this.state.user.backgroundImagePath})` }} >
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
                        {(this.state.user.role_id === RoleIds.Student) && (
                            <div style={{ width: "188px" }}>
                                <label>Compte privé :<input type="checkbox" className='checkbox' checked={this.state.user.privacy} onChange={this.handleOpenPrivacy} /></label>
                            </div>
                        )}
                        <Button variant="contained" onClick={this.handleClickOpen} className='backgroundButton'>Modifier l'arrière plan</Button>
                        <Dialog open={this.state.openBackground} onClose={this.handleClose}>
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
                                        this.setState({
                                            backgroundUrlField: e.target.value
                                        });
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
                                        onChange={e => {
                                            this.setState({
                                                backgroundImageFile: e.target.files[0]
                                            });

                                        }}
                                    />
                                </Button>
                                <div hidden={this.state.backgroundImageFile === null}>
                                    <Check></Check> Image importée
                                </div>
                                <div className="hiddenAlert">
                                    <Alert variant="filled" severity="error" >
                                        L'url de l'image n'est pas valide.
                                    </Alert>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose}>Annuler</Button>
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
                                    onChange={e => this.setState({ avatarUrlField: e.target.value })}
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
                                        onChange={e => {
                                            this.setState({
                                                avatarImageFile: e.target.files[0]
                                            });
                                        }}
                                    />
                                </Button>
                                <div hidden={this.state.avatarImageFile === null}>
                                    <Check></Check> Image importée
                                </div>
                                <div className="hiddenAlert">
                                    <Alert variant="filled" severity="error" >
                                        L'url de l'image n'est pas valide.
                                    </Alert>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleCloseAvatar}>Annuler</Button>
                                <Button onClick={this.handleDeleteAvatar}>Supprimer</Button>
                                <Button onClick={this.handleModifyAvatar}>Modifier</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
                <ConfirmationPopup isOpen={this.state.openConfirmationPopup} onCancel={this.handleClosePrivacyConfirmationPopup} onConfirm={this.handleConfirmPrivacyChange} message={this.state.confirmPrivacyMessage} />
                <BadgeList user={this.state.user} />
            </div>
        );
    }
}