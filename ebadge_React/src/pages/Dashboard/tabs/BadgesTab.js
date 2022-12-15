import React from 'react';
import Api from '../../../utils/Api';
import BadgeGrid from '../../../composant/Dashboard/BadgeGrid';
import Item from '@mui/material/Grid';
import BadgeCreateForm from '../../../composant/BadgeCreateForm';
import { Button, Dialog, Slide } from '@mui/material';
import './../Dashboard.css';
import { Add } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class BadgesTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closeBadgeForm: false,
            badges: []
        }

        this.handleBadgeForm = this.handleBadgeForm.bind(this);
        this.getBadges = this.getBadges.bind(this);
        this.addBadge = this.addBadge.bind(this);
        this.editBadge = this.editBadge.bind(this);
        this.deleteBadge = this.deleteBadge.bind(this);
    }

    componentDidMount() {
        this.getBadges();
    }

    /**
     * Recupere la liste des badges depuis l'API
     */
    getBadges() {
        Api.get('/badge').then(res => {
            const badges = res.data;
            this.setState({ badges: badges.badges });
        }
        )
    }

    handleBadgeForm() {
        this.setState({ closeBadgeForm: !this.state.closeBadgeForm });
    }

    addBadge(badge) {
        this.setState({ badges: [badge, ...this.state.badges] });
    }

    editBadge(badge) {
        const badges = this.state.badges;
        const index = badges.findIndex(b => b.id === badge.id);
        badges[index] = badge;
        this.setState({ badges: badges });
    }

    deleteBadge(badge) {
        const badges = this.state.badges;
        const index = badges.findIndex(b => b.id === badge.id);
        badges.splice(index, 1);
        this.setState({ badges: badges });
    }

    render() {
        return (
            <Item className='bordered'>
                <div className="title">
                    <h4>Liste des badges</h4>
                    <Button variant="contained" onClick={this.handleBadgeForm} startIcon={<Add></Add>}>Créer un badge</Button>
                    <Dialog fullScreen open={this.state.closeBadgeForm} onClose={this.handleBadgeForm} TransitionComponent={Transition}>
                        <BadgeCreateForm handleClose={this.handleBadgeForm} addBadge={this.addBadge} editBadge={this.editBadge} deleteBadge={this.deleteBadge} />
                    </Dialog>
                </div>
                <BadgeGrid rows={this.state.badges} refresh={this.getBadges} />
            </Item>
        );
    }
}

export default BadgesTab;