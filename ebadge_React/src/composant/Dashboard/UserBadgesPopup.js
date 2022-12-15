import React from "react";
import './UserBadgesPopup.css';
import Api from '../../utils/Api';

import { FormControl, InputLabel, Select, MenuItem, Button, Avatar } from "@mui/material";
import { Dialog, DialogContent, DialogTitle, DialogContentText  } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import { Backdrop, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


class UserBadgesPopup extends React.Component {

    constructor(props) {
        super(props);

        this.loadingCount = 0;

        this.state = {
            loading: false,
            leftBadges: [],
            ownBadges: [],
            showSuccessMessage: false,
            badgeIdToAssignErrorMessage: '',
            badgeIdToAssign: 0,
            columns: [
                {
                    field: 'imagePath', headerName: 'Image', width: 70,
                    renderCell: (params) => {
                        return <Avatar alt={params.row.title} src={params.row.imagePath} />;
                    }
                },
                { field: 'title', headerName: 'Titre', flex: 1 },
                {
                    field: "removeBadgeAction",
                    minWidth: 200,
                    headerName: "",
                    sortable: false,
                    renderCell: (params) => {
                        const onClick = (e) => {
                            e.stopPropagation();

                            this.removeBadge(params.row.id);

                        };

                        return <Button variant="outlined" onClick={onClick}>retirer le badge</Button>;
                    }
                }

            ]
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCloseSuccessMessage = this.handleCloseSuccessMessage.bind(this);
        this.clearForm = this.clearForm.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.badgeIdToAssign === 0) {
            this.setState({ badgeIdToAssignErrorMessage: 'Veuillez sélectionner un badge' });
            return;
        }

        this.addStep();

        Api.post('/user/assign-badge', {
            user_id: this.props.selectedUser.id,
            badge_id: this.state.badgeIdToAssign
        }).then((response) => {
            this.refreshBadgesAssignation();
            this.setState({ showSuccessMessage: true });
        })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                this.removeStep();
            });
    }

    clearForm() {
        this.setState({ badgeIdToAssign: null, badgeIdToAssignErrorMessage: '' });
    }

    async refreshBadgesAssignation(delay = false) {
        this.addStep();
        setTimeout(() => {
            this.refreshOwnBadges();
            this.refreshPendingBadges();
            this.removeStep();
            this.clearForm();
        }, delay ? 500 : 0);
    }

    /**
     * Refresh the list of badges that can be assigned to the user
     */
    refreshPendingBadges() {
        this.addStep();
        Api.get("/user/" + this.props.selectedUser.id + "/badges-left")
            .then((response) => {
                this.setState({ leftBadges: response.data.badges });
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                this.removeStep();
            });

    }

    /**
     * Remove a badge from the user
     * @param {int} badgeId
     * @returns
     * */
    removeBadge(badgeId) {
        this.addStep();
        Api.post('/user/remove-badge', {
            user_id: this.props.selectedUser.id,
            badge_id: badgeId
        }).then((response) => {
            this.refreshBadgesAssignation();
        })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                this.removeStep();
            });
    }

    /**
     * Refresh the list of badges that are already assigned to the user
     * @returns
     * 
     **/
    refreshOwnBadges() {
        this.addStep();
        Api.get("/user/" + this.props.selectedUser.id + "/badges")
            .then((response) => {
                this.setState({ ownBadges: response.data.badges });
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                this.removeStep();
            });
    }

    handleCloseSuccessMessage() {
        this.setState({ showSuccessMessage: false });
    }

    /**
     * Add a step to the loading count
     */
    addStep() {
        this.loadingCount++;

        if (this.loadingCount > 0 && !this.state.loading) {
            this.setState({ loading: true });
        }
    }

    /**
     * Remove a step to the loading count
     **/
    removeStep() {
        this.loadingCount--;

        if (this.loadingCount < 0) {
            this.loadingCount = 0;
        }

        if (this.loadingCount <= 0 && this.state.loading) {
            this.setState({ loading: false });
        }
    }


    render() {
        return (

            <Dialog open={this.props.isOpen ?? false} onClose={this.props.handleClose}>
                <DialogTitle>Assignation des badges</DialogTitle>
                <DialogContent className={"badge-popup"}>
                    <DialogContentText>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={this.state.loading}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>

                        <Snackbar onClose={this.handleCloseSuccessMessage}  open={this.state.showSuccessMessage} autoHideDuration={3000}>
                            <Alert onClose={this.handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }} md={{ minWidth: '300px' }}>
                                Le badge a été assigné avec succès !
                            </Alert>
                        </Snackbar>
                        <form>
                            <FormControl fullWidth>
                                <InputLabel id="badge-select-label">Badge à assigner </InputLabel>
                                {this.state.loadingCount}
                                <Select
                                    id="badge-select"
                                    required
                                    label="Badge à assigner"
                                    name="badgeIdToAssign"
                                    labelId="badge-select-label"
                                    className="badge-selector"
                                    value={this.state.badgeIdToAssign}
                                    error={this.state.badgeIdToAssignErrorMessage !== ""}
                                    helperText={this.state.badgeIdToAssignErrorMessage === "" ? "" : this.state.badgeIdToAssignErrorMessage}
                                    onChange={this.handleChange}
                                >
                                    {

                                        this.state.leftBadges.length === 0 ? <MenuItem disabled value={0}>Aucun badge disponible</MenuItem> :
                                            this.state.leftBadges.map((badge) => {
                                                return (
                                                    <MenuItem value={badge.id} key={badge.id}>
                                                        <div className="badge-row">
                                                            <Avatar className="badge" alt={badge.title} src={badge.imagePath} />
                                                            {badge.title}
                                                        </div>

                                                    </MenuItem>)
                                            }
                                            )

                                    }
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>

                                <Button variant="contained" className={"mt-2"} onClick={this.handleSubmit} >Assigner le badge</Button>
                            </FormControl>

                        </form>

                        <hr />
                        Liste des badges obtenues

                        <DataGrid
                            autoHeight={true}
                            rows={this.state.ownBadges ?? []}
                            columns={this.state.columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                        />


                    </DialogContentText>
                </DialogContent>
            </Dialog >
        );
    }
}

export default (UserBadgesPopup);
