import React from "react";

class BadgeComposant extends React.Component {
    render() {
      return (<div className='Badge'>
                <img src={this.props.badge.imagePath} alt='badge' className='badgeIcon'/>
                <div className="hideDisplay">
                  <h3 className='textBadge'>{this.props.badge.title}</h3>
                  <p>{this.props.badge.description}</p>
                  <p>Pourcentage d'obtention : TODO</p>
                </div>
            </div>
      );
    }
  }

  export default (BadgeComposant);
