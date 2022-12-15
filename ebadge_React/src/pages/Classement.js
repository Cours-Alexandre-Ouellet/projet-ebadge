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
            classement: [],
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

    componentDidMount() {
        Api.get('/stats/leaderboard') 
            .then(response => { 
                let position = 1;
                response.data.forEach(element => {
                    element.position = position;
                    position++;
                }).catch((error) => {
                    console.log(error);
                });
                if (response.data.length === 0) {
                    this.setState({ classement: [] });
                } else {
                    this.setState({ classement: response.data });
                }
            }
        );
    }


    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

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