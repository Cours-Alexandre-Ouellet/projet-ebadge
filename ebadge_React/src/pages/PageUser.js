import React, { useEffect, useState } from "react";
import './PageUser.css'
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
export default function PageUser() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const params = useParams();
  const [loaded, setLoaded] = useState(false);


  /**
   * cherche les donnée de l'utilisateur
   */
  useEffect(() => {
    if (params.id) {
      Api.get(`/user/${params.id}`)
        .then((response) => {
          if (response.data.user.avatarImagePath == null) {
            console.log("avatar null");
            response.data.user.avatarImagePath =
              "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png";
          }
          if (response.data.user.backgroundImagePath == null) {
            console.log("background null");
            response.data.user.backgroundImagePath = "../background.png";
          }
          setLoaded(true);
          setUser(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  if (user) {
    if (user.user.privacy == 0) {
      return (
        <div
          className="background"
          style={{
            backgroundImage: `url(${user.user.backgroundImagePath})`,
          }}
        >
          {!loaded?<Loading></Loading>:<br></br>}
          <div className="profil">
            <div>
              <img className="avatar" src={user.user.avatarImagePath} />
              
            </div>
            <div className="infosUser">
              <p>
                <strong className="invertedText" style={{ backgroundImage: `url(${user.user.backgroundImagePath})` }}>
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
    <Loading></Loading>;
  }
}
