import React from "react";
/**
 * @param {Object} props
 * @param {Object} props.category - Objet category
 * @param {string} props.category.name - Nom de la catégorie
 */
class CategoryComponent extends React.Component {
  render() {
    return (<div className='category'>
      <div className="hideDisplay">
        <h3 className='textCategory'>{this.props.category.name}</h3>
        {/* <p>Pourcentage d'obtention : {this.props.badge.possession ? (this.props.badge.possession).toFixed(0) : 0}%</p> */}
      </div>
    </div>
    );
  }
}

export default (CategoryComponent);
