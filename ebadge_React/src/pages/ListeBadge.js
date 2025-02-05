import React from "react";
import "./ListeBadge.css";
import "@mui/material";
import {
  TextField,
  InputAdornment,
} from "@mui/material";
import { Avatar } from "@mui/material";
import { Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Api from "../utils/Api";
/**
 * Page affichant deux listes de badges une de badges obtenus et une de badges non obtenus. 
 * 
 * le code à été en partie inspirer de Classement.js pour garder un theme constant dans le site.
 */
class ListeBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      closeBadgeForm: false,
      /**
       * initialisation des badges vide
       */
      badgesObtenus: [],
      badgesNonObtenus: [],
      search: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.filtrerBadgesObtenus = this.filtrerBadgesObtenus.bind(this);
    this.filtrerBadgesNonObtenus = this.filtrerBadgesNonObtenus.bind(this);
  }

  /**
   * fonction allant chercher tout les badges obtenues et non obtenues
   */
  componentDidMount() {
    let id = null;
    Api.get("/auth/current_user")
      .then((response) => {
        id = response.data.id;
        Api.get("/user/" + id + "/badges")
          .then((response) => {
            const badges = response.data;
            console.log(badges);
            this.setState({ badgesObtenus: Object.values(badges).flat() });
          })
          .catch((error) => {
            console.log(error);
          });
        Api.get("/user/" + id + "/badges-left")
          .then((response) => {
            const badges = response.data;
            this.setState({ badgesNonObtenus: Object.values(badges).flat() });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * fonction qui permet de mettre à jour le state quand on change la valeur d'un champ
   * @param {*} event
   */
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  /**
   *  fonction qui permet de filtrer les badges obtenus par par leur nom
   * @returns les badges possedant le nom recherché
   */
  filtrerBadgesObtenus() {
    return this.state.badgesObtenus.filter((item) => {
      return item.title.toLowerCase().includes(this.state.search.toLowerCase());
    });
  }

  /**
   *  fonction qui permet de filtrer les badges non obtenus par par leur nom
   * @returns les badges possedant le nom recherché
   */
  filtrerBadgesNonObtenus() {
    return this.state.badgesNonObtenus.filter((item) => {
      return item.title.toLowerCase().includes(this.state.search.toLowerCase());
    });
  }

  render() {
    let columns = [
      { field: "title", headerName: "titre", width: 150 },
      { field: "description", headerName: "description", width: 150 },
      {
        field: "imagePath",
        headerName: "Image",
        sortable: false,
        flex: 2,
        align: "center",
        headerAlign: "center",
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
                  value={this.state.search}
                  onChange={this.handleChange}
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
                    rows={this.filtrerBadgesObtenus()}
                    columns={columns}
                  />
                </div>
                <div style={{ height: 400, width: "100%" }}>
                <div className="listeBadge-title">
              <h2>Non obtenus</h2>
            </div>
                  <DataGrid
                    rows={this.filtrerBadgesNonObtenus()}
                    columns={columns}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListeBadge;
