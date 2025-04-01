import React, { useEffect, useState } from "react";
import './PageProfile.css';
import '@mui/material';
import { Button, Autocomplete, Avatar } from '@mui/material';
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

export default function PageProfile(){
    const [badgeIdToFavorite,setBadgeIdToFavorite]= useState(0);
    const [badgeIdToFavoriteErrorMessage,setBadgeIdToFavoriteErrorMessage]= useState("");
    const [favoriteBadges,setFavoriteBadges]= useState([]);
    const [otherBadges,setOtherBadges]= useState([]);
    const [openBackground,setOpenBackground]= useState(false);
    const [openBadges,setOpenBadges]= useState(false);
    const [openConfirmationPopup,setOpenConfirmationPopup]= useState(false);
    const [confirmPrivacyMessage,setConfirmPrivacyMessage]= useState(null);
    const [openAvatar, setOpenAvatar]= useState(false);
    const [avatarUrlField, setAvatarUrlField] = useState("");
    const [avatarImageFile, setAvatarImageFile] = useState(null);
    const [user, setUser] = useState({});
    const [backgroundUrlField, setBackgroundUrlField] = useState("");
    const [backgroundImageFile, setBackgroundImageFile] = useState(null);
    const [levelAvatar, setLevelAvatar] = useState(23.90);


    /**
     * fonction qui récupère les données de l'utilisateur connecté
     */
    useEffect(()  => {
        Api.get("/auth/current_user").then((response) => {
            if (response.data.avatarImagePath == null) {
                console.log("avatar null");
                response.data.avatarImagePath = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png";
            }
            if (response.data.backgroundImagePath == null) {
                console.log("background null");
                response.data.backgroundImagePath = "./background.png";
            }
            setUser(response.data);
            updatePrivacyMessage();
        }).catch((error) => {
            console.error(error);
        });
    },[]);

    /**
     * Fonction qui met à jour le message de confirmation de modification de l'anonymat
     */
    function updatePrivacyMessage() {
        setConfirmPrivacyMessage(
            <p id='privacyMessage'>
                Un compte privé ne sera pas visible dans les classements et ne sera pas accessible par les autres utilisateurs.
                <br /><br />
                Voulez-vous vraiment rendre votre compte {user.privacy ? 'public' : 'privé'} ?
            </p>
        );
    }

    /**
     * Fonction qui gère l'ouverture de la fenêtre de modification de l'anonymat
     */
    function handleOpenPrivacyConfirmationPopup() {
        setOpenConfirmationPopup(true);
    };

    /**
     * Fonction qui gère la fermeture de la fenêtre de modification de l'anonymat
     */
    function handleClosePrivacyConfirmationPopup() {
        setOpenConfirmationPopup(false);
    };

    /**
     * Fonction qui valide et effectue le changement de l'anonymat
     */
    function handleConfirmPrivacyChange(){
        const isAnonymous = !user.privacy;
        setOpenConfirmationPopup(false);
        setUser({...user, privacy:isAnonymous});

        setTimeout(updatePrivacyMessage, TRANSITION_DURATION);

        Api.post('/user/edit-privacy', {
            privacy: isAnonymous
        }).catch((error) => {
            console.error(error);
        });
    }

    /**
     * Fonction qui gère l'ouverture de la fenêtre de modification de l'anonymat
     */
    function handleOpenPrivacyConfirmationPopup() {
        setOpenConfirmationPopup(true);
    };

    /**
     * fonction qui gère l'ouverture de la fenêtre de modification du fond d'écran
     */
    function handleClickOpen(){
        setOpenBackground(true);
    };

    /**
     * fonction qui gère l'ouverture de la fenêtre de modification des badges favoris
     */
    function handleClickBadge(){
        setOpenBadges(true);
    };

    /**
     * fonction qui gère la fermeture de la fenêtre de modification du fond d'écran
     */
    function handleClose() {
        setOpenBackground(false);
    };

    /**
     * fonction qui gère la fermeture de la fenêtre de modification des badges favoris
     */
    function handleCloseBadge() {
        setOpenBadges(false);
    };

    /**
     * fonction qui gère la modification du fond d'écran
     */
    function handleModify(){
        if (backgroundImageFile != null) {
            let formData = new FormData();
            formData.append('background', backgroundImageFile);

            Api.post('/user/edit-background', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                setOpenBackground(false);
                setUser({...user,backgroundImagePath: response.data.url});
            }).catch((error) => {
                console.error(error);
            });
            setBackgroundImageFile(null);
        } else if (isImage(backgroundUrlField)) {
            setOpenBackground(false);
            setUser({...user,backgroundImagePath:backgroundUrlField})
            
            Api.post('/user/edit-background', {
                backgroundUrl: user.backgroundImagePath
            }).catch((error) => {
                console.error(error);
            });
        }
        setBackgroundImageFile(null);
    };

    /**
     * fonction qui gère la suppression du fond d'écran 
     */
    function handleDelete(){
        let newUser = user;
        newUser.backgroundImagePath = "./background.png";
        setUser(newUser);
        setOpenBackground(false);
    };

    /**
     * fonction qui gère la modification de l'url de l'avatar
     */
    function handleClickOpenAvatar() {
        setOpenAvatar(true);
    };

    /**
     * fonction qui gère la fermeture de la fenêtre de modification de l'avatar
     */
    function handleCloseAvatar(){
        setOpenAvatar(false);
    };

    /**
     * fonction qui gère la modification de l'avatar
     */
    function handleModifyAvatar () {
        if (avatarImageFile != null) {
            let formData = new FormData();
            formData.append('avatar', avatarImageFile);

            Api.post('/user/edit-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                user.avatarImagePath = response.data.url;
                setOpenAvatar(false);
            }).catch((error) => {
                console.error(error);
            });

        } else if (isImage(avatarUrlField)) {
            user.avatarImagePath = avatarUrlField;
            setOpenAvatar(false);

            Api.post('/user/edit-avatar', {
                avatarUrl: user.avatarImagePath
            }).catch((error) => {
                console.error(error);
            });
        }
        setAvatarImageFile(null);
    };

    /**
     * fonction qui gère la suppression de l'avatar
     */
    function handleDeleteAvatar() {
        let newUser = user;
        newUser.avatarImagePath = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png";
        setUser(newUser);
        setOpenAvatar(false);
    };

    /**
     * Ouvre la fenêtre de confirmation de modification de l'anonymat
     */
    function handleOpenPrivacy(e){
        setOpenConfirmationPopup(true);
    }
    
    if (user == null || !user.id) {
        return <Loading></Loading>
    }
    return (
        <div className='background' style={{ backgroundImage: `url(${user.backgroundImagePath})` }} >
            <div className='profil'>
                <div>
                    <img className='avatar' src={user.avatarImagePath} />
                    <div className='imageProfile'>
                        <label htmlFor="avatar">
                            <img className='editImage' onClick={handleClickOpenAvatar} src='http://cdn.onlinewebfonts.com/svg/img_520583.png' alt="profil" title='image de profil' />
                        </label>
                    </div>
                </div>
                <div className='infosUser'>
                    <p><strong className="invertedText" style={{ backgroundImage: `url(${user.backgroundImagePath})` }}>{user.first_name} {user.last_name}</strong></p>
                    {(user.role_id === RoleIds.Student) && (
                        <div>
                        <div style={{ width: "188px" }}>
                            <label className="invertedText" style={{ backgroundImage: `url(${user.backgroundImagePath})` }} >Compte privé :<input type="checkbox" className='checkbox' checked={user.privacy} onChange={handleOpenPrivacy} /></label>
                        </div>
                        {/* <Button variant="contained" onClick={handleClickBadge} className='badgeButton'>Modifier les badges favoris</Button> */}
                        </div>
                    )}
                    <Button variant="contained" onClick={handleClickOpen} className='backgroundButton'>Modifier l'arrière plan</Button>
                    <Dialog open={openBackground} onClose={handleClose}>
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
                                    setBackgroundUrlField(e.target.value);
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
                                        setBackgroundImageFile(e.target.files[0]);
                                    }}
                                />
                            </Button>
                            <div hidden={backgroundImageFile === null}>
                                <Check></Check> Image importée
                            </div>
                            <div className="hiddenAlert">
                                <Alert variant="filled" severity="error" >
                                    L'url de l'image n'est pas valide.
                                </Alert>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Annuler</Button>
                            <Button onClick={handleDelete}>Supprimer</Button>
                            <Button onClick={handleModify}>Modifier</Button>
                        </DialogActions>
                    </Dialog>

{/* 



                    <Dialog open={openBadges} onClose={handleCloseBadge}>
                        <DialogTitle>Badges à afficher</DialogTitle>
                        <DialogActions>
                            <Button onClick={handleCloseBadge}>Fermer</Button>
                        </DialogActions>
                        <Autocomplete
                            id="badge-select"
                            options={otherBadges}
                            getOptionLabel={(option) => option.title}
                            value={otherBadges.find(badge => badge.id === badgeIdToFavorite) || null}
                            onChange={(event, newValue) => setBadgeIdToFavorite(newValue ? newValue.id : null)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Badge à assigner"
                                    variant="outlined"
                                    error={!!badgeIdToFavoriteErrorMessage}
                                    labelId="badge-select-label"
                                    />
                            )}
                            renderOption={(props, option) => (
                                <li {...props}>
                                <Avatar alt={option.title} src={option.imagePath} sx={{ marginRight: 1 }} />
                                {option.title}
                                </li>
                           )}
                            noOptionsText="Aucun badge disponible"
                            />
                    </Dialog>

 */}



                    <Dialog open={openAvatar} onClose={handleCloseAvatar}>
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
                                onChange={e => setAvatarUrlField( e.target.value)}
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
                                        setAvatarImageFile(e.target.files[0]);
                                    }}
                                />
                            </Button>
                            <div hidden={avatarImageFile === null}>
                                <Check></Check> Image importée
                            </div>
                            <div className="hiddenAlert">
                                <Alert variant="filled" severity="error" >
                                    L'url de l'image n'est pas valide.
                                </Alert>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseAvatar}>Annuler</Button>
                            <Button onClick={handleDeleteAvatar}>Supprimer</Button>
                            <Button onClick={handleModifyAvatar}>Modifier</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
            <ConfirmationPopup isOpen={openConfirmationPopup} onCancel={handleClosePrivacyConfirmationPopup} onConfirm={handleConfirmPrivacyChange} message={confirmPrivacyMessage} />
            <BadgeList user={user} />
        </div>
    );
    
}