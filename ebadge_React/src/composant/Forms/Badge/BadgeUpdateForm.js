import React, { useEffect, useState, useMemo } from 'react';
import '@mui/material';
import { Button, TextField, Autocomplete, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Alert } from '@mui/material';
import { PhotoCamera, Check, Refresh } from '@mui/icons-material';
import Api from '../../../utils/Api';
import './BadgeCreateForm.css';
import BadgeComponent from '../../PageProfil/BadgeComponent';
import Loading from '../../Loading/LoadingComponent';



function isImage(url) {
    return /(http(s?):)*\.(?:jpg|gif|png)/.test(url);
}

/**
 * Formulaire de modification de badge
 * @param {Object} errorBadge - Popup d'erreur dans la modificaiton du Badge
 * @param {Object} editBadge - Popup odification de badge
 * @param {Object} handleClose - Ferme une fenêtre
 * @param {Object} selectedBadge - Badge a modifié
 * @returns Le react de la page du formulaire de modification
 * @author Vincent Houle /partiellement
 */
export default function BadgeUpdateForm({ handleClose, editBadge, selectedBadge, errorBadge }) {
    const badgeDummy = structuredClone(selectedBadge);
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [imageUrlField, setImageUrlField] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [badge, setBadge] = useState(badgeDummy);

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        Api.get('/category/').then((response) => {
            setCategories(response.data.categories);
            
            Api.get(`/badge/category/name/${badge.id}`).then((response) => {
                setLoading(false);

                if (response.data != null)
                    setBadge((prevState => (
                        {
                            ...prevState,
                            category: response.data
                        }
                    )));
            }).catch((_) => {
                errorBadge("Erreur lors de la selection du nom de la catégory du badge.")
            });

        }).catch((_) => {
            errorBadge("Erreur lors de la recherche des catégories.")
        });


    }, []);


    // Gère l'ouverture et la fermeture de l'image
    const handleImageDialog = () => {
        setOpenImageDialog(!openImageDialog);
    }

    // Gère la suppression de l'image
    const handleImageDelete = () => {
        setImageFile(null);
        setBadge((prevState => (
            {
                ...prevState,
                imagePath: null
            }
        )));
        handleImageDialog();
    }

    // Gère les modification de l'image du badge
    const handleImageModify = () => {
        if (imageFile !== null) {
            setBadge((prevState => (
                {
                    ...prevState,
                    imagePath: URL.createObjectURL(imageFile)
                }
            )));

            handleImageDialog();

        } else if (isImage(imageUrlField)) {
            setImageFile(null);
            setBadge((prevState => (
                {
                    ...prevState,
                    imagePath: imageUrlField
                }
            )));
            handleImageDialog()
        } else {
            alert('Image invalide');
        }
    }

    // Valide le titre du badge
    const validateTitle = () => {
        setTitleError("");
        if (badge.title.length === 0) {
            setTitleError('Veuillez renseigner le titre');
            return false;
        } else {
            return true;
        }
    }

    // Valide la description du badge
    const validateDescription = () => {
        setDescriptionError('');
        if (badge.description.length === 0) {
            setDescriptionError('Veuillez renseigner la description');
            return false;
        } else {
            return true;
        }
    }

    // Gère l'envoie vers l'api
    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateTitle() && validateDescription()) {
            let formData = new FormData();
            formData.append('id', badge.id)
            formData.append('title', badge.title);
            formData.append('description', badge.description);
            // Si l'image est un lien ou bien un fichier
            imageFile === null || formData.append('image', imageFile);
            badge.imagePath === null || formData.append('imagePath', badge.imagePath);

            if (badge.category) {
                badge.category.id === undefined || formData.append('category_id', badge.category.id);
                badge.category.name === undefined || formData.append('category_name', badge.category.name);
            }

            Api.post('/badge/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((response) => {
                    console.log(response.data)
                    editBadge(response.data);
                })
                .catch((_) => {
                    errorBadge('Erreur lors de la modification du badge');
                });
            handleClose();
        }
    }


    return (
        <div className="badge-create-form">
            <div className="badge-create-form-container">
                <div className="badge-create-form-background">
                    <div className="badge-create-form-content">
                        <h1>Modifier un badge</h1>
                        <form className='create-badge'>
                            <TextField
                                id="title"
                                name="title"
                                label="Titre"
                                variant="outlined"
                                defaultValue={badge.title}
                                onChange={(e) => {
                                    setBadge((prevState => ({
                                        ...prevState,
                                        title: e.target.value
                                    })));

                                }}
                                onBlur={validateTitle}
                                error={titleError.length > 0}
                                helperText={titleError}
                                inputProps={{ maxLength: 45 }}
                                required
                                sx={{ width: '80%', marginTop: '20px' }}
                            />
                            <TextField
                                id="description"
                                name="description"
                                label="Description"
                                variant="outlined"
                                multiline
                                rows={4}
                                inputProps={{ maxLength: 255 }}
                                defaultValue={badge.description}
                                onChange={(e) => {
                                    setBadge((prevState => ({
                                        ...prevState,
                                        description: e.target.value
                                    })));
                                }}
                                onBlur={validateDescription}
                                error={descriptionError.length > 0}
                                helperText={descriptionError}
                                required
                                sx={{ width: '80%', marginTop: '20px' }}
                            />
                            <div className='badge-create-form-category-selector'>
                                {loading ? <Loading></Loading> :
                                    <Autocomplete
                                        value={badge.category}
                                        onChange={(_, newValue) => {
                                            setBadge(prevState => ({
                                                ...prevState,
                                                category: newValue
                                            }));

                                        }}
                                        loading={!loading}
                                        id="controllable-states-demo"
                                        options={categories.map((category) => category)}
                                        getOptionLabel={(categories) => categories.name}
                                        isOptionEqualToValue={(option, value) => option.id == value.id}
                                        sx={{ width: 300 }}
                                        renderInput={(params) => <TextField {...params} label="Catégories" />}
                                    />
                                }
                            </div>
                            <div className="badge-create-form-button-field">
                                <Button
                                    variant="contained"
                                    color='secondary'
                                    onClick={handleImageDialog}
                                    sx={{
                                        width: '100%',
                                        marginTop: '20px',
                                        marginRight: '20px'
                                    }}
                                    startIcon={<PhotoCamera />}
                                >
                                    {badge.imagePath ? 'Modifier l\'image' : 'Ajouter une image'}
                                </Button>
                                <Dialog open={openImageDialog} onClose={handleClose}>
                                    <DialogTitle>Modifier l'image du badge</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Pour changer l'image du badge, veuillez entrer l'URL de l'image.
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            name='imagePath'
                                            label="URL"
                                            type="url"
                                            fullWidth
                                            variant="standard"
                                            defaultValue={imageUrlField}
                                            inputProps={{ maxLength: 2048 }}
                                            onChange={(e) => {
                                                setImageUrlField(e.target.value);
                                                setImageFile(null);
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
                                                    setImageFile(e.target.files[0]);
                                                    setImageUrlField("");
                                                }}
                                            />
                                        </Button>
                                        <div hidden={imageFile === null}>
                                            <Check></Check> Image importée
                                        </div>
                                        <div className="hiddenAlert">
                                            <Alert variant="filled" severity="error" >
                                                L'url de l'image n'est pas valide.
                                            </Alert>
                                        </div>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleImageDialog}>Annuler</Button>
                                        <Button onClick={handleImageDelete}>Supprimer</Button>
                                        <Button onClick={handleImageModify}>Modifier</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                            <div className="badge-create-form-button-submit">
                                <Button onClick={handleSubmit} variant="contained" sx={{
                                    width: '100%',
                                    marginTop: '20px',
                                    marginRight: '20px'
                                }}>Modifier</Button>
                                <Button variant="outlined" onClick={handleClose} sx={{
                                    width: '100%',
                                    marginTop: '20px', 
                                }}>Annuler</Button>
                                
                            </div>
                        </form>
                    </div>
                    <div className="badge-create-form-preview">
                        <h2>Prévisualisation</h2>
                        <div className="badge-create-form-preview-content">
                            <BadgeComponent badge={badge}></BadgeComponent>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}