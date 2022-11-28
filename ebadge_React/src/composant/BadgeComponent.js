import React from "react";

class BadgeComposant extends React.Component {
    render() {
      return (<div className='Badge'>
                <img src={this.props.badge.imageurl} alt='badge' className='badgeIcon'/>
                <div className="hideDisplay">
                  <h3 className='textBadge'>{this.props.badge.titre}</h3>
                  <p>{this.props.badge.description}</p>
                  <p>Pourcentage d'obtention : {this.props.badge.pourcentage}</p>
                </div>
            </div>
      );
    }
  }

  export default (BadgeComposant);
