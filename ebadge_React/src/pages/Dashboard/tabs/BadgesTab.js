import React from 'react';
import Api from '../../../utils/Api';
import BadgeGrid from '../../../composant/Dashboard/BadgeGrid';
import Item from '@mui/material/Grid';
import BadgeCreateForm from '../../../composant/Forms/Badge/BadgeCreateForm';
import { Button, Dialog, Slide, Snackbar, Alert } from '@mui/material';
import './../Dashboard.css';
import { Add } from '@mui/icons-material';
import Loading from '../../../composant/Loading/LoadingComponent';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class BadgesTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closeBadgeForm: false,
            showSuccessMessage: false,
            successMessage: '',
            showErrorMessage: false,
            errorMessage: '',
            badges: [],
            charge: false
        }

        this.handleBadgeForm = this.handleBadgeForm.bind(this);
        this.getBadges = this.getBadges.bind(this);
        this.addBadge = this.addBadge.bind(this);
        this.editBadge = this.editBadge.bind(this);
        this.deleteBadge = this.deleteBadge.bind(this);
        this.errorBadge = this.errorBadge.bind(this);
        this.handleCloseSuccessMessage = this.handleCloseSuccessMessage.bind(this);
        this.handleCloseErrorMessage = this.handleCloseErrorMessage.bind(this);
    }

    componentDidMount() {
        this.getBadges();
    }

    /**
     * Recupere la liste des badges depuis l'API
     */
    getBadges() {
        Api.get('/badge/my-badges-prof').then(res => {
            const badges = res.data;
            this.setState({ badges: badges });
            this.setState({charge : true});
        }
        )
        .catch(err => {
            this.errorBadge("Erreur lors de la récupération des badges.");
          });
    }

    handleBadgeForm() {
        this.setState({ closeBadgeForm: !this.state.closeBadgeForm });
    }

    addBadge(badge) {
        this.setState({ badges: [badge, ...this.state.badges], successMessage: 'Le badge a été ajouté avec succès !', showSuccessMessage: true });
    }

    editBadge(badge) {
        const badges = this.state.badges.map(b => {
            if (b.id === badge.id) {
                return badge;
            }
            return b;
        });
        this.setState({ badges, successMessage: 'Le badge a été modifié avec succès !', showSuccessMessage: true });
    }

    deleteBadge(badge) {
        console.log(badge);
        console.log(this.state.badges);
        const badges = this.state.badges.filter(b => b.id !== badge.id);
        console.log(badges);
        this.setState({ badges, successMessage: 'Le badge a été supprimé avec succès !', showSuccessMessage: true });
        console.log(this.state.badges);
    }


    handleCloseSuccessMessage() {
        this.setState({ showSuccessMessage: false, successMessage: '' });
    }

    errorBadge(message) {
        this.setState({ errorMessage: message, showErrorMessage: true });
    }

    handleCloseErrorMessage() {
        this.setState({ showErrorMessage: false, errorMessage: '' });
    }

    render() {
        return (
            <Item className='bordered'>
                <div className="title">
                    <h4>Liste des badges</h4>
                    <Button variant="contained" onClick={this.handleBadgeForm} startIcon={<Add></Add>}>Créer un badge</Button>
                    <Dialog fullScreen open={this.state.closeBadgeForm} onClose={this.handleBadgeForm} TransitionComponent={Transition}>
                        <BadgeCreateForm handleClose={this.handleBadgeForm} addBadge={this.addBadge} errorBadge={this.errorBadge} />
                    </Dialog>
                </div>
                <BadgeGrid rows={this.state.badges} refresh={this.state.badges.length === 0 ? this.getBadges :() => {}} deleteBadge={this.deleteBadge} editBadge={this.editBadge} errorBadge={this.errorBadge} />
                <Snackbar onClose={this.handleCloseSuccessMessage} open={this.state.showSuccessMessage} autoHideDuration={3000}>
                    <Alert onClose={this.handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }} md={{ minWidth: '300px' }}>
                        {this.state.successMessage}
                    </Alert>
                </Snackbar>
                <Snackbar onClose={this.handleCloseErrorMessage} open={this.state.showErrorMessage} autoHideDuration={3000}>
                    <Alert onClose={this.handleCloseErrorMessage} severity="error" sx={{ width: '100%' }} md={{ minWidth: '300px' }}>
                        {this.state.errorMessage}
                    </Alert>
                </Snackbar>
                {this.state.charge?<hr></hr>:<Loading/>}
            </Item>
        );
    }
}

export default BadgesTab;