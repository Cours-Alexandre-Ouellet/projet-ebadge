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
        this.deleteProgram = this.deleteProgram.bind(this);
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
        this.setState({  });
        Api.post('/program', {
            name: name
        }).then(res => {
            this.setState({ programs: [...this.state.programs, res.data], showProgramForm: false });
        });
    }

    handleDialogClose() {
        this.setState({ showProgramForm: false });
    }

    deleteProgram(id){
        Api.delete("/program?id=" + id).then(res => {
            console.log(res);
            this.setState({programs: this.state.programs.filter(program => program.id !== res.data.deleted)});
        });
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
                <ProgramGrid rows={this.state.programs} deleteProgram={this.deleteProgram} />
            </Item>
        );
    }
}

export default Dashboard;