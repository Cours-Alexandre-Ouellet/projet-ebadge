import React from "react";
import './Classement.css';
import '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, InputAdornment } from '@mui/material';
import { Search } from "@mui/icons-material";

class Classement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classement: [
                {
                    "id": 1,
                    "position": 1,
                    "name": "Jean",
                    "score": 100
                },
                {
                    "id": 2,
                    "position": 2,
                    "name": "Pierre",
                    "score": 50
                },
                {
                    "id": 3,
                    "position": 3,
                    "name": "Paul",
                    "score": 25
                },
                {
                    "id": 4,
                    "position": 4,
                    "name": "Jacques",
                    "score": 10
                },
                {
                    "id": 5,
                    "position": 5,
                    "name": "Marie",
                    "score": 5
                },
                {
                    "id": 6,
                    "position": 6,
                    "name": "Jeanne",
                    "score": 2
                },
                {
                    "id": 7,
                    "position": 7,
                    "name": "Pierre",
                    "score": 1
                },
                {
                    "id": 8,
                    "position": 8,
                    "name": "Paul",
                    "score": 0
                },
                {
                    "id": 9,
                    "position": 9,
                    "name": "Jacques",
                    "score": 0
                },
                {
                    "id": 10,
                    "position": 10,
                    "name": "Marie",
                    "score": 0
                },
                {
                    "id": 11,
                    "position": 11,
                    "name": "Jeanne",
                    "score": 0
                },
                {
                    "id": 12,
                    "position": 12,
                    "name": "Pierre",
                    "score": 0
                },
                {
                    "id": 13,
                    "position": 13,
                    "name": "Paul",
                    "score": 0
                },
                {
                    "id": 14,
                    "position": 14,
                    "name": "Jacques",
                    "score": 0
                }
            ],
            sessions: [
                {
                    "id": 1,
                    "name": "Session 1"
                },
                {
                    "id": 2,
                    "name": "Session 2"
                },
                {
                    "id": 3,
                    "name": "Session 3"
                }
            ],
            session: 1,
            search: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.filterClassement = this.filterClassement.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    filterClassement() {
        return this.state.classement.filter((item) => {
            return item.name.toLowerCase().includes(this.state.search.toLowerCase());
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
                                    onChange={this.handleChange}
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
                                        {this.filterClassement().map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.position}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.score}</TableCell>
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