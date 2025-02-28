import React, { useEffect, useState } from "react";
import './PageVisite.css'
import Api from "../utils/Api";
import { Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import Loading from "../composant/Loading/LoadingComponent";
import BadgeList from "../composant/PageProfil/BadgeList";

/**
 * revoie la page d'un utilisateur
 * l'id de l'utilisateur doit etre envoyé dans l'url de la page
 * @returns la page de l'étudiant
 */
export default function PageVisiteUtilisateur() {
  const [utilisateur, setUtilisateur] = useState(null);
  const location = useLocation();
  const params = useParams();


  /**
   * cherche les donnée de l'utilisateur
   */
  useEffect(() => {
    if (params.id) {
      Api.get(`/user/${params.id}`)
        .then((response) => {
          if (response.data.utilisateur.avatarImagePath == null) {
            console.log("avatar null");
            response.data.utilisateur.avatarImagePath =
              "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png";
          }
          if (response.data.utilisateur.backgroundImagePath == null) {
            console.log("background null");
            response.data.utilisateur.backgroundImagePath = "../background.png";
          }
          setUtilisateur(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  if (utilisateur) {
    if (utilisateur.utilisateur.privacy == 0) {
      return (
        <div
          className="background"
          style={{
            backgroundImage: `url(${utilisateur.utilisateur.backgroundImagePath})`,
          }}
        >
          <div className="profil">
            <div>
              <img className="avatar" src={utilisateur.utilisateur.avatarImagePath} />
              
            </div>
            <div className="infosUser">
              <p>
                <strong>
                  {utilisateur.utilisateur.first_name} {utilisateur.utilisateur.last_name}
                </strong>
              </p>
              
              
            </div>
          </div>
          <BadgeList user={utilisateur.utilisateur} />
        </div>
      );
    } else {
      return <Typography>Cet utilisateur est privé</Typography>;
    }
  } else {
    <Loading></Loading>;
  }
}
