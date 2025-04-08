import React, { createContext, useContext, useState, useEffect } from "react";
import Api from "../utils/Api";

const BadgeListContext = createContext();
const BadgeListContextProvider = ({ children }) => {
  const [currentFavoriteBadges, setCurrentFavoriteBadges] = useState([]);
  const [userContext, setUserContext] = useState(0);
  const [loaded, setLoaded]= useState(true)

  useEffect(() => {
    updateFavoriteBadges();
  }, []);

  const updateFavoriteBadges = async () => {
    console.log(userContext);
    if (userContext) {
        console.log("&&&&&&&&&&&&&&&&");
        console.log(loaded);
        Api.get(`/user/${userContext}/favoriteBadges`)
            .then((response) => {
              setCurrentFavoriteBadges(response.data.badges);
              setLoaded(false);
              console.log("%%%%%%%%%%%%%%%%%%%%%%");
            })
            .catch((error) => {
              console.error(error);
            });
      }
  };

  return (
    <BadgeListContext.Provider
      value={{ currentFavoriteBadges, updateFavoriteBadges,userContext, setUserContext, loaded, setLoaded }}
    >
      {children}
    </BadgeListContext.Provider>
  );
};

export { BadgeListContext, BadgeListContextProvider };
