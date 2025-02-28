import React, { useEffect,useState } from "react";
import BadgeComponent from "./BadgeComponent";
import Api from "../../utils/Api";

/**
 * élément affichant la liste de tous les badges d'un utilisateur
 * @returns la liste de badge
 */
export default function BadgeList(props) {
  const [utilisateur, setUtilisateur] = useState(props.user);
  const [badges, setBadges] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (utilisateur.id) {
      Api.get(`/user/${utilisateur.id}/badges`)
        .then((response) => {
          console.log(response.data);
          setBadges(response.data.badges);
          setChargement(false);
        })

        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  if (chargement) {
    return (
      <div className="BadgeArray">
        <h1>Chargement des badges...</h1>
      </div>
    );
  }

  return (
    <div className="BadgeArray">
      {badges.length ? (
        badges.map((badge, index) => {
          return <BadgeComponent badge={badge} key={index} />;
        })
      ) : (
        <h1>Vous n'avez aucun badge</h1>
      )}
    </div>
  );
}
