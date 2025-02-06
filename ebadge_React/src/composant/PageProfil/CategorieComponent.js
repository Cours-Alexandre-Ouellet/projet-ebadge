import React from "react";
/**
 * @param {Object} props
 * @param {Object} props.categorie - Objet categorie
 * @param {string} props.categorie.nom - Nom de la catégorie
 */
class CategorieComponent extends React.Component {
  render() {
    return (<div className='categorie'>
      <div className="hideDisplay">
        <h3 className='textCategorie'>{this.props.categorie.nom}</h3>
        {/* <p>Pourcentage d'obtention : {this.props.badge.possession ? (this.props.badge.possession).toFixed(0) : 0}%</p> */}
      </div>
    </div>
    );
  }
}

export default (CategorieComponent);
