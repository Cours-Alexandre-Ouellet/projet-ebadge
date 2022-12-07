import React from "react";

class BadgeComponent extends React.Component {
    render() {
      return (<div className='Badge'>
                <img src={this.props.badge.imagePath} alt="Une erreur est survenue avec l'url de l'image" className='badgeIcon' style={{"backgroundColor": this.props.badge.color}}/>
                <div className="hideDisplay">
                  <h3 className='textBadge'>{this.props.badge.title}</h3>
                  <p>{this.props.badge.description}</p>
                  <p>Pourcentage d'obtention : TODO</p>
                </div>
            </div>
      );
    }
  }

  export default (BadgeComponent);
