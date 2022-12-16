import React from 'react';
import '@mui/material';
import Item from '@mui/material/Grid';
import './../Dashboard.css';
import Api from '../../../utils/Api';
import { Button, Slide, Dialog } from '@mui/material';
import { Add } from '@mui/icons-material';
import OrganisationGrid from '../../../composant/Dashboard/Organisations/OrganisationGrid';
import OrganisationForm from '../../../composant/Dashboard/Organisations/OrganisationForm';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            organisations: []
        }

        this.deleteOrganisation = this.deleteOrganisation.bind(this);
        this.addOrganisation = this.addOrganisation.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.showDialog = this.showDialog.bind(this);

    }

    componentDidMount() {
        Api.get('/organisation')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    organisations: response.data
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    deleteOrganisation(id) {
        Api.delete('/organisation?id=' + id)
            .then((response) => {
                if (response.data.deleted) {
                    this.setState({
                        organisations: this.state.organisations.filter((organisation) => organisation.id !== response.data.deleted)
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    addOrganisation(name) {
        Api.post('/organisation', {
            name: name
        })
            .then((response) => {
                this.setState({ showDialog: false });
                if (response.data) {
                    this.setState({
                        organisations: [...this.state.organisations, response.data]
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleDialogClose() {
        this.setState({ showDialog: false });
    }

    showDialog() {
        this.setState({ showDialog: true });
    }

    render() {
        return (
            <Item className='bordered'>
                <div className='title'>
                    <h4>Liste des organisations</h4>
                    <Button variant="contained" onClick={this.showDialog} startIcon={<Add></Add>}>Créer une organisation</Button>
                    <Dialog open={this.state.showDialog} onClose={this.handleDialogClose} TransitionComponent={Transition}>
                        <OrganisationForm addOrganisation={this.addOrganisation}/>
                    </Dialog>
                </div>
                <OrganisationGrid rows={this.state.organisations} deleteOrganisation={this.deleteOrganisation} />
            </Item>
        );
    }
}

export default Dashboard;