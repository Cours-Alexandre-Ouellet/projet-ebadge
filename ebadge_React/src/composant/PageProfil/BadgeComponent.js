import React from "react";

class BadgeComponent extends React.Component {
  render() {
    return (<div className='Badge'>
      <img src={this.props.badge.imagePath} alt={this.props.badge.title} className='badgeIcon' style={{ "backgroundColor": `#${this.props.badge.color}`  }} />
      <div className="hideDisplay">
        <h3 className='textBadge'>{this.props.badge.title}</h3>
        <p>{this.props.badge.description}</p>
        <p>Pourcentage d'obtention : {(this.props.badge.possession).toFixed(0)}%</p>
      </div>
    </div>
    );
  }
}

export default (BadgeComponent);