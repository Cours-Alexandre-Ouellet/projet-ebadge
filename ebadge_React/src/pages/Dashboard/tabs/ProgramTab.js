import React from 'react';
import '@mui/material';
import Item from '@mui/material/Grid';
import './../Dashboard.css';
import Api from '../../../utils/Api';
import ProgramGrid from '../../../composant/Dashboard/Programs/ProgramGrid';
import { Button, Slide, Dialog } from '@mui/material';
import { Add } from '@mui/icons-material';
import ProgramForm from '../../../composant/Dashboard/Programs/ProgramForm';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            programs: [],
            showProgramForm: false,
        }
        this.getPrograms = this.getPrograms.bind(this);
        this.showAddProgram = this.showAddProgram.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.addProgram = this.addProgram.bind(this);

    }

    componentDidMount() {
        this.getPrograms();
    }

    /**
     * Recupere la liste des utilisateurs depuis l'API
     */
    getPrograms() {
        Api.get('/program').then(res => {
            const programs = res.data;
            this.setState({ programs: programs });
        });
    }

    showAddProgram() {
        this.setState({ showProgramForm: true });
    }

    addProgram(name) {
        console.log(name);
        this.setState({ showProgramForm: false });
    }

    handleDialogClose() {
        this.setState({ showProgramForm: false });
    }

    render() {
        return (
            <Item className='bordered'>
                <div className='title'>
                    <h4>Liste des programmes</h4>
                    <Button variant="contained" onClick={this.showAddProgram} startIcon={<Add></Add>}>Créer un programme</Button>
                    <Dialog open={this.state.showProgramForm} onClose={this.handleDialogClose} TransitionComponent={Transition}>
                        <ProgramForm addProgram={this.addProgram}></ProgramForm>
                    </Dialog>
                </div>
                <ProgramGrid rows={this.state.programs} />
            </Item>
        );
    }
}

export default Dashboard;