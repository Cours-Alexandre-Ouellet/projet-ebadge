import { Button, TextField } from "@mui/material";
import React from "react";
import "./Program.css";
export default class ProgramForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: ""
        }
    }

    render() {
        return (
            <div className="form-dialog">
                <h3>Créer un programme</h3>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    this.props.addProgram(this.state.name);
                }}>
                    <TextField
                        id="name"
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value })}
                        required
                    />

                    <Button variant="contained" color="primary" type="submit">
                        Créer
                    </Button>


                </form>
            </div>
        );
    }
}