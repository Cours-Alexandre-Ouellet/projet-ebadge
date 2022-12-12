import React from 'react';
import '@mui/material';
import Api from '../../../utils/Api';
import BadgeGrid from '../../../composant/Dashboard/BadgeGrid';
import Item from '@mui/material/Grid';
import BadgeCreateForm from '../../../composant/BadgeCreateForm';
import { Button, Dialog, Slide } from '@mui/material';
import './BadgesTab.css'
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
            this.setState({ users: badges });
        }
        )
    }

    handleBadgeForm() {
        this.setState({ closeBadgeForm: !this.state.closeBadgeForm });
    }

    render() {
        return (
            <Item className='bordered'>
                <div className="title">
                    <h4>Liste des badges</h4>
                    <Button variant="contained" onClick={this.handleBadgeForm} startIcon={<Add></Add>}>Créer un badge</Button>
                    <Dialog fullScreen open={this.state.closeBadgeForm} onClose={this.handleBadgeForm} TransitionComponent={Transition}>
                        <BadgeCreateForm handleClose={this.handleBadgeForm} />
                    </Dialog>
                </div>
                <BadgeGrid rows={this.state.badges} />
            </Item>
        );
    }
}

export default BadgesTab;