import React, { useEffect, useState } from "react";
import "./ListeBadge.css";
import "@mui/material";
import { TextField, InputAdornment } from "@mui/material";
import { Avatar } from "@mui/material";
import { Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Api from "../utils/Api";
import BadgePopup from "../composant/Dashboard/BadgePopup";
/**
 * Page affichant deux listes de badges une de badges obtenus et une de badges non obtenus.
 *
 * le code à été en partie inspirer de Classement.js pour garder un theme constant dans le site.
 */
export default function ListeBadge() {
  const [badgesObtenus, setBadgesObtenus] = useState([]);
  const [badgesNonObtenus, setBadgesNonObtenus] = useState([]);
  const [search, _] = useState("");
  const [open, setOpen] = useState(false);
  const [badgeSelectionne, setBadgeSelectionne] = useState(null);

  /**
   * fonction allant chercher tout les badges obtenues et non obtenues
   */
  useEffect(() => {
    console.log(1);
    let id = null;
    Api.get("/auth/current_user")
      .then((response) => {
        console.log(2);
        id = response.data.id;
        Api.get("/user/" + id + "/badges")
          .then((response) => {
            console.log(3);
            const badges = response.data;
            setBadgesObtenus(Object.values(badges).flat());
          })
          .catch((error) => {
            console.log(error);
          });
        Api.get("/user/" + id + "/badges-left")
          .then((response) => {
            console.log(4);
            const badges = response.data;
            setBadgesNonObtenus( Object.values(badges).flat() );
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  },[]);

  /**
   * fonction qui permet de mettre à jour le state quand on change la valeur d'un champ
   * @param {*} event
   */
  function handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  /**
   *  fonction qui permet de filtrer les badges obtenus par par leur nom
   * @returns les badges possedant le nom recherché
   */
  function filtrerBadgesObtenus() {
    return badgesObtenus.filter((item) => {
      return item.title.toLowerCase().includes(search.toLowerCase());
    });
  }

  /**
   *  fonction qui permet de filtrer les badges non obtenus par par leur nom
   * @returns les badges possedant le nom recherché
   */
  function filtrerBadgesNonObtenus() {
    return badgesNonObtenus.filter((item) => {
      return item.title.toLowerCase().includes(search.toLowerCase());
    });
  }

  /**
   * Ferme la popup de gestion des badges
   * @param {*} event
   */
  function handleClose() {
    setOpen(false);
  }

  let columns = [
    { field: "title", headerName: "titre", width: 150 },
    { field: "description", headerName: "description", width: 150 },
    {
      field: "imagePath",
      headerName: "Image",
      sortable: false,
      flex: 2,
      align: "center",
      renderCell: (params) => {
        return (
          <Avatar
            alt={params.row.title}
            src={params.value}
            sx={{ width: 40, height: 40 }}
          />
        );
      },
    },
  ];

  /**
   * Ouvre le popup en changeant sa visibilité
   * @param {*} params 
   */
  function handleRowClick(params){
    setBadgeSelectionne(params.row);
    setOpen(true);
  };

  return (
    <div className="listeBadge">
      <div className="listeBadge-container">
        <div className="listeBadge-background">
          <div className="listeBadge-title">
            <h1>Badges</h1>
          </div>
          <div className="listeBadge-table">
            <div className="listeBadge-table-header">
              <TextField
                id="search"
                name="search"
                label="Rechercher un nom"
                variant="outlined"
                value={search}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ margin: "5px", width: "100%" }}
              />
            </div>
            <div className="listeBadge-listes">
              <div style={{ height: 400, width: "100%" }}>
                <div className="listeBadge-title">
                  <h2>Obtenus</h2>
                </div>
                <DataGrid
                  onRowClick={handleRowClick}
                  rows={filtrerBadgesObtenus()}
                  columns={columns}
                />
              </div>
              <div style={{ height: 400, width: "100%" }}>
                <div className="listeBadge-title">
                  <h2>Non obtenus</h2>
                </div>
                <DataGrid
                  onRowClick={handleRowClick}
                  rows={filtrerBadgesNonObtenus()}
                  columns={columns}
                />
              </div>
            </div>
            <BadgePopup
              isOpen={open}
              selectedBadge={badgeSelectionne}
              handleClose={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
