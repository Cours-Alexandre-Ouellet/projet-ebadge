import React, { useContext, useEffect,useState } from "react";
import BadgeComponent from "./BadgeComponent";
import Api from "../../utils/Api";
import { BadgeListContext } from "../../context/BadgeListContext";

/**
 * élément affichant la liste de tous les badges d'un utilisateur
 * @returns la liste de badge
 */
export default function BadgeList(props) {
  const [user, setUser] = useState(props.user);
  const {currentFavoriteBadges, updateFavoriteBadges} = useContext(BadgeListContext);
  const {loaded} = useContext(BadgeListContext)


  if (loaded) {
    return (
      <div className="BadgeArray">
        <h1>Chargement des badges...</h1>
      </div>
    );
  }

  return (
    <div className="BadgeArray">
      {currentFavoriteBadges.length ? (
        currentFavoriteBadges.map((badge, index) => {
          return <BadgeComponent badge={badge} key={index} />;
        })
      ) : (
        <h1>Vous n'avez aucun badge</h1>
      )}
    </div>
  );
}
