import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Api from '../../utils/Api';
import { DataGrid } from '@mui/x-data-grid';
import './UserBadgesPopup.css';

class UserBadgesPopup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            leftBadges: [],
            ownBadges: [],
            badgeIdToAssign: 0,
            columns: [
                { field: 'id', headerName: 'ID', flex: 1 },
                {
                    field: "removeBadgeAction",
                    minWidth: 200,
                    headerName: "",
                    sortable: false,
                    renderCell: (params) => {
                        const onClick = (e) => {
                            e.stopPropagation();
                        };

                        return <Button variant="outlined" onClick={onClick}>retirer le badge</Button>;
                    }
                }

            ]
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    componentDidMount() {
    }


    render() {
        return (

            <Dialog open={this.props.isOpen ?? false} onClose={this.props.handleClose}>
                <DialogTitle>Assignation des badges</DialogTitle>
                <DialogContent className={"badge-popup"}>
                    <DialogContentText>
                        Assigner un badge
                        <FormControl fullWidth>
                            <InputLabel id="badge-select-label">Badge à assigner</InputLabel>
                            <Select
                                labelId="badge-select-label"
                                id="badge-select"
                                label="Badge à assigner"
                                name="badgeToAssign"
                                onChange={this.handleChange}
                            >
                                {
                                    this.state.leftBadges.map((badge) => {
                                        return <MenuItem value={badge.id}>{badge.title}</MenuItem>
                                    })
                                }
                            </Select>
                            <Button variant="contained" className={"mt-2"} >Assigner le badge</Button>
                        </FormControl>
                        <hr />
                        Liste des badges obtenues

                        <DataGrid
                            rows={this.props.rows ?? []}
                            columns={this.state.columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                        />


                    </DialogContentText>
                </DialogContent>
            </Dialog>
        );
    }
}

export default (UserBadgesPopup);
