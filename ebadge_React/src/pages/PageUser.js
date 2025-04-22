import React, { useEffect, useState, useContext } from "react";
import "../composant/PageProfile.css";
import Api from "../utils/Api";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import Loading from "../composant/Loading/LoadingComponent";
import BadgeList from "../composant/PageProfil/BadgeList";
import { BadgeListContext } from "../context/BadgeListContext";
import { RoleIds } from "../policies/Role";

/**
 * La page d'un utilisateur
 * L'id de l'utilisateur doit être envoyé dans l'url de la page
 * @returns la page de l'étudiant
 */
export default function PageUser() {
  const [user, setUser] = useState({});
  const { updateFavoriteBadges } = useContext(BadgeListContext);
  const { userContext, setUserContext } = useContext(BadgeListContext);
  const params = useParams();
  const { setLoaded } = useContext(BadgeListContext);
  const [error, setError] = useState(false);

  /**
   * Cherche les données de l'utilisateur
   */
  useEffect(() => {
    setLoaded(true);
    if (params.id) {
      Api.get(`/user/${params.id}`)
        .then((response) => {
          if (response.data.user.avatarImagePath == null) {
            response.data.user.avatarImagePath =
              "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png";
          }
          if (response.data.user.backgroundImagePath == null) {
            response.data.user.backgroundImagePath = "../background.png";
          }
          setLoaded(true);
          setUser(response.data);
          setUserContext(response.data.user.id);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
          setError(true);
        });
    }
  }, []);
  useEffect(() => {
    updateFavoriteBadges();
  }, [userContext]);
  if (!error) {
    if (user.user) {
      console.log(user);
      if (user.user.role_id === RoleIds.Student) {
        if (user.user.privacy == 0) {
          return (
            <div
              className="background"
              style={{
                backgroundImage: `url(${user.user.backgroundImagePath})`,
              }}
            >
              <div className="profil">
                <div>
                  <img className="avatar" src={user.user.avatarImagePath} />
                </div>
                <div className="infosUser">
                  <p>
                    <strong>
                      {user.user.first_name} {user.user.last_name}
                    </strong>
                  </p>
                </div>
              </div>
              <BadgeList user={user.user} />
            </div>
          );
        } else {
          return <Typography>Cet utilisateur est privé</Typography>;
        }
      } else {
        console.log(user.user.role_id);
        console.log(user);
        console.log(RoleIds.Student);
        return (
          <Typography>Seuls les étudiants peuvent être affichés</Typography>
        );
      }
    } else {
      return <Loading></Loading>;
    }
  } else {
    return <Typography>Cet utilisateur n'existe pas</Typography>;
  }
}
