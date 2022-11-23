import * as React from 'react';
import './pageProfil.css';
import '@mui/material';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef } from 'react'
import BadgeComposant from './BadgeComponent';

var background = "";
var styleBackground = {
    backgroundImage: "url(" + background + ")"
};
var styleAvatar = {
    content : "url(" + "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png" + ")"
};

function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }


export default function PageProfil() {
    var Badge = [
        {
            titre : "Badge 1",
            description : "Description du badge 1",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 2",
            description : "Description du badge 2",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 3",
            description : "Description du badge 3",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 4",
            description : "Description du badge 4",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 5",
            description : "Description du badge 5",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 6",
            description : "Description du badge 6",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 7",
            description : "Description du badge 7",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 8",
            description : "Description du badge 8",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 9",
            description : "Description du badge 9",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 1",
            description : "Description du badge 1",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 2",
            description : "Description du badge 2",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 3",
            description : "Description du badge 3",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 4",
            description : "Description du badge 4",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 5",
            description : "Description du badge 5",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 6",
            description : "Description du badge 6",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 7",
            description : "Description du badge 7",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 8",
            description : "Description du badge 8",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 9",
            description : "Description du badge 9",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 1",
            description : "Description du badge 1",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 2",
            description : "Description du badge 2",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 3",
            description : "Description du badge 3",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 4",
            description : "Description du badge 4",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 5",
            description : "Description du badge 5",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 6",
            description : "Description du badge 6",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 7",
            description : "Description du badge 7",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 8",
            description : "Description du badge 8",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        },
        {
            titre : "Badge 9",
            description : "Description du badge 9",
            imageurl : "https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif",
            pourcentage : "50%"
        }
    ];  
    var levelAvatar = "23.90";
    var fillBar = {
        width : levelAvatar.split(".")[1] + "%",
    }
    const [open, setOpen] = React.useState(false);
    var valueRef = useRef('')

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    
    const handleModify = () => {

        background = valueRef.current.value;
        styleBackground = {
            backgroundImage: "url(" + background + ")"
        };
        setOpen(false);
        return console.log(valueRef.current.value + " " + styleBackground.backgroundImage);
    };
    var avatarImage = "https://www.w3schools.com/howto/img_avatar.png"
    const [openAvatar, setOpenAvatar] = React.useState(false);
    var valueRefAvatar = useRef('')
    const handleClickOpenAvatar = () => {
        setOpenAvatar(true);
      };
    
      const handleCloseAvatar = () => {
        setOpenAvatar(false);
      };
      
      const handleModifyAvatar = () => {

        avatarImage = valueRefAvatar.current.value;
        if(isImage(avatarImage)){
            styleAvatar = {
                content: "url(" + avatarImage + ")"
            };
        } else {
            styleAvatar = {
                content: "url(" + "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png" + ")"
            };
        }
        setOpenAvatar(false);
        console.log(avatarImage);
      };


    return (
        <div className='background' style={ styleBackground }>
            <div className='profil'>
                <div>
                    <img className='avatar' style={styleAvatar}/>
                    <div>
                        <label htmlFor="avatar">
                            <img className='theCog' onClick={handleClickOpenAvatar} src='http://cdn.onlinewebfonts.com/svg/img_520583.png'  alt="profil" title='image de profil'/>
                        </label>
                    </div> 
                </div>
                <div className='infosUser'>
                    <p>Nom d'utilisateur</p>
                    <p># de groupe</p>
                    <div>
                        <label>Compte privé :<input type="checkbox" className='checkbox'/></label>
                    </div>
                    <br />
                    <Button variant="contained" onClick={handleClickOpen}>Modifier le l'arrière plan</Button>
                    <Dialog open={open} onClose={handleClose}>
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
                                inputRef={valueRef}  
                            />
                            <br />
                            <br />
                            <br />
                            <DialogContentText>
                                Vous pouvez également importé une image.
                            </DialogContentText>
                            <br/>
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
                            </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleModify}>Modifier</Button>
                        </DialogActions>
                </Dialog>
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
                                inputRef={valueRefAvatar}  
                            />
                            <br />
                            <br />
                            <br />
                            <DialogContentText>
                                Vous pouvez également importé une image.
                            </DialogContentText>
                            <br/>
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
                            </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseAvatar}>Cancel</Button>
                            <Button onClick={handleModifyAvatar}>Modifier</Button>
                        </DialogActions>
                </Dialog>
                </div>
                <div className="infosLevel">
                    <p>Level : {levelAvatar.split(".")[0]}</p>
                    <div className="progressBar">
                        <div className="progressBarFill" style={fillBar}></div>
                    </div>
                </div>
            </div>
            <div className='BadgeArray'>
                    {Badge.map((leBadge, index) => {
                        return <BadgeComposant badge={leBadge}/>
                    })}                        
            </div>
        </div>
    );
}