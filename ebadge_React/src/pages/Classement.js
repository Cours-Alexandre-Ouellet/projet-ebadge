import React from "react";
import './Classement.css';
import '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, InputAdornment } from '@mui/material';
import { Search } from "@mui/icons-material";
import Api from "../utils/Api";

class Classement extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            closeBadgeForm: false,
            /** 
             * initialisation du classement vide, on va le remplir avec les données de la base de données
             */
            classement: [],
            /**
             * sessions disponibles dans l'applications, on peut en rajouter dans le code seulement pour l'instant
             * ajouter une table dans la base de données pour les sessions
             * et les récupérer depuis la base de données pourrait être une bonne idée
             */
            sessions: [
                {
                    "id": 1,
                    "name": "Session automne 2021",
                    "dateDebut": "2021-08-23",
                    "dateFin": "2021-12-30"

                },
                {
                    "id": 2,
                    "name": "Session hiver 2022",
                    "dateDebut": "2022-01-25",
                    "dateFin": "2022-05-30"
                },
                {
                    "id": 3,
                    "name": "Session automne 2022",
                    "dateDebut": "2022-08-25",
                    "dateFin": "2022-12-30"
                }
            ],
            session: 1,
            search: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.filterClassement = this.filterClassement.bind(this);
    }
    /**
     * fonction qui permet d'aller chercher les données du classement à la session n°1 par défaut quand on ouvre la page
     */
    componentDidMount() {
        Api.get('/stats/leaderboard/' + this.state.sessions[0].dateDebut + '/' + this.state.sessions[0].dateFin) 
            .then(response => { 
                const leaderboard = response.data;

                for (let i = 0; i < leaderboard.length; i++) {
                    leaderboard[i].position = i + 1;
                }
                this.setState({ classement: leaderboard });
            }).catch((error) => {
                console.log(error);
        });
    }

    /**
     * fonction qui permet de mettre à jour le classement quand on change de session
     * @param {*} event 
     */
    handleChangeSession = (event) => {
        this.setState({ session: event.target.value });
        console.log('/stats/leaderboard/' + this.state.sessions[event.target.value - 1].dateDebut + '/' + this.state.sessions[event.target.value - 1].dateFin);
        Api.get('/stats/leaderboard/' + this.state.sessions[event.target.value - 1].dateDebut + '/' + this.state.sessions[event.target.value - 1].dateFin) 
            .then(response => { 
                const leaderboard = response.data;

                for (let i = 0; i < leaderboard.length; i++) {
                    leaderboard[i].position = i + 1;
                }
                this.setState({ classement: leaderboard });
            }).catch((error) => {
                console.log(error);
            }
        );
    };

    /**
     * fonction qui permet de mettre à jour le state quand on change la valeur d'un champ
     * @param {*} event 
     */
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    /**
     *  fonction qui permet de filtrer le classement par le nom de l'utilisateur
     * @returns le classement filtré par le nom de l'utilisateur
     */
    filterClassement() {
        return this.state.classement.filter((item) => {
            return item.username.toLowerCase().includes(this.state.search.toLowerCase());
        });
    }

    render() {
        return (
            <div className="classement">
                <div className="classement-container">
                    <div className="classement-background">
                        <div className="classement-title">
                            <h1>Classement</h1>
                        </div>
                        <div className="classement-table">
                            <div className="classement-table-header">
                                <Select
                                    native
                                    value={this.state.session}
                                    onChange={this.handleChangeSession}
                                    inputProps={{
                                        name: 'session',
                                        id: 'session',
                                    }}
                                    sx={{ margin: "5px", width: "100%" }}
                                >
                                    {this.state.sessions.map((session) => (
                                        <option key={session.id} value={session.id}>{session.name}</option>
                                    ))}
                                </Select>

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
                            <TableContainer sx={{
                                border: 1,
                                borderColor: '#c4c4c4',
                                borderStyle: 'solid',
                                borderRadius: 1,
                                maxHeight: 'calc(100vh - 350px)',
                                width: '98%',
                                
                            }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Position</TableCell>
                                            <TableCell>Nom</TableCell>
                                            <TableCell>Score</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.filterClassement().map((item, index) => (
                                            <TableRow key={item.id}>
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
        )
    }
}


export default (Classement);