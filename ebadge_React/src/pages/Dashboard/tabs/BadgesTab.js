import React from 'react';
import '@mui/material';
import Api from '../../../utils/Api';
import BadgeGrid from '../../../composant/Dashboard/BadgeGrid';
import Item from '@mui/material/Grid';

class BadgesTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            badges: []
        }
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

    render() {
        return (
            <Item className='bordered'>
                <h4>Liste des badges</h4>
                <BadgeGrid rows={this.state.badges} />
            </Item>
        );
    }
}

export default BadgesTab;