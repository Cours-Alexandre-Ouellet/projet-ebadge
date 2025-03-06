
import React, { useEffect, useState } from "react";

import "./Leaderboard.css";
import "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Api from "../utils/Api";
import { useNavigate } from "react-router-dom";
import Loading from "../composant/Loading/LoadingComponent";

/**
 * Classe Leaderboard qui permet d'afficher le classement des utilisateurs
 */
export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [sessions, _] = useState([]);
  const [session, setSession] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [charge, setCharge] = useState(false);
  

  /**
   * fonction qui permet d'aller chercher les données du classement à la session n°1 par défaut quand on ouvre la page
   */
  useEffect(() => {
    // Api.get('/stats/leaderboard/' + this.state.sessions[3].dateDebut + '/' + this.state.sessions[3].dateFin)
    Api.get("/stats/leaderboard")
      .then((response) => {
        const valeursLeaderboard = response.data;

        for (let i = 0; i < valeursLeaderboard.length; i++) {
          valeursLeaderboard[i].position = i + 1;
        }
        setCharge(true);
        setLeaderboard(valeursLeaderboard);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  /**
   * fonction qui permet de mettre à jour le classement quand on change de session
   * @param {*} event
   */
  function handleChangeSession(event) {
    setSession(event.target.value);
    console.log(
      "/stats/leaderboard/" +
        sessions[event.target.value - 1].dateDebut +
        "/" +
        sessions[event.target.value - 1].dateFin
    );
    Api.get(
      "/stats/leaderboard/" +
        sessions[event.target.value - 1].dateDebut +
        "/" +
        sessions[event.target.value - 1].dateFin
    )
      .then((response) => {
        const valeursLeaderboard = response.data;

        for (let i = 0; i < valeursLeaderboard.length; i++) {
          valeursLeaderboard[i].position = i + 1;
        }
        setLeaderboard(valeursLeaderboard);

      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * fonction qui permet de mettre à jour la valeur du search
   * @param {*} event
   */
  function handleChange(event) {
    const valeur = event.target.value;
    setSearch(valeur);

  }

  /**
   *  fonction qui permet de filtrer le classement par le nom de l'utilisateur
   * @returns le classement filtré par le nom de l'utilisateur
   */
  function filterLeaderboard() {
    return leaderboard.filter((item) => {
      return item.username.toLowerCase().includes(search.toLowerCase());
    });
  }
  
  /**
   * fonction dirigeant l'utilisateur vers la page de l'utilisateur qu'il veut visité
   * @param {*} id l'id de l'utilisateur à visité
   */
  function visiteUtilisateur(id) {
    console.log(id);
    navigate(`/utilisateur/${id}`);
  }

  return (
    <div className="leaderboard">
      {!charge?<Loading></Loading>:<hr></hr>}
      <div className="leaderboard-container">
        <div className="leaderboard-background">
          <div className="leaderboard-title">
            <h1>Classement</h1>
          </div>
          <div className="leaderboard-table">
            <div className="leaderboard-table-header">
              <Select
                native
                value={session}
                onChange={handleChangeSession}
                inputProps={{
                  name: "session",
                  id: "session",
                }}
                sx={{ margin: "5px", width: "100%" }}
              >
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </Select>

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
            <TableContainer
              sx={{
                border: 1,
                borderColor: "#c4c4c4",
                borderStyle: "solid",
                borderRadius: 1,
                maxHeight: "calc(100vh - 350px)",
                width: "98%",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Position</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterLeaderboard().map((item, index) => (
                    <TableRow
                      key={item.id}
                      onClick={() => visiteUtilisateur(item.id)}
                      className="colone"
                    >
                      <TableCell>{item.position}</TableCell>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>{item.badges_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

