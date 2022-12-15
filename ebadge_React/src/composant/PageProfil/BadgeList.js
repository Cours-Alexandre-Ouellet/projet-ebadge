import React from 'react';
import BadgeComponent from './BadgeComponent';
import Api from '../../utils/Api';

export default class BadgeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            badges: [],
            loading: true
        }
    }

    componentDidMount() {
        Api.get('/user/' + this.state.user.id + '/badges')
            .then((response) => {
                this.setState({
                    badges: response.data.badges,
                    loading: false
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        if (this.state.loading) {
            return (
                <div className='BadgeArray'>
                    <h1>Chargement des badges...</h1>
                </div>
            )
        }

        return (
            <div className='BadgeArray'>
                {this.state.badges.length ? this.state.badges.map((badge, index) => {
                    return <BadgeComponent badge={badge} key={index}/>
                }) : <h1>Vous n'avez aucun badge</h1>}
            </div>
        )
    }
}