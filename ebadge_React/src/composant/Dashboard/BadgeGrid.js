import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Avatar, Slide, Dialog, Switch } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import BadgeDeleteAction from "./Popups/BadgeDeletePopup/BadgeDeletePopup";
import BadgeUpdateForm from "../Forms/Badge/BadgeUpdateForm";
import Api, { getResource } from "../../utils/Api";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class BadgeGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      pageSize: 5,
      openDeleteDialog: false,
      openEditDialog: false,
      selectedBadge: null,
      columns: [
        {
          field: "imagePath",
          headerName: "Image",
          sortable: false,
          flex: 2,
          align: "center",
          headerAlign: "center",
          renderCell: (rows) => {
            return (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
              <Avatar
                alt={rows.row.title}
                src={rows.value || getResource("badge.png")}
                sx={{ width: 70, height: 70, boxShadow: `0 0 8px 10px ${rows.row.categoryColor}` }}
              />
            </div>
            );
          },
        },
        { field: "title", headerName: "Titre", flex: 2, headerAlign: "center" },
        {
          field: "description",
          headerName: "Description",
          flex: 3,
          headerAlign: "center",
        },
        { field: "category", headerName: "Catégorie", flex: 4, headerAlign: "center" },
        {
          field: "BadgeActivationAction",
          flex: 1,
          headerName: "Activé",
          align: "center",
          headerAlign: "center",
          sortable: false,
          hideable: false,
          renderCell: (rows) => {
            return (
              <Switch
                checked={rows.row.activated == 1}
                onChange={() =>
                  this.handleChangeActivated(rows.row.id, rows.row.activated)
                }
              ></Switch>
            );
          },
        },
        {
          field: "BadgeEditAction",
          minWidth: 150,
          headerName: "",
          flex: 1,
          align: "center",
          headerAlign: "center",
          sortable: false,
          hideable: false,
          renderCell: (params) => {
            const onClick = (e) => {
              e.stopPropagation();

              this.setState({
                openEditDialog: true,
                selectedBadge: params.row,
              });
            };
            return (
              <Button
                variant="outlined"
                onClick={onClick}
                startIcon={<Edit></Edit>}
              >
                Modifier
              </Button>
            );
          },
        },

        {
          field: "BadgeDeleteAction",
          minWidth: 150,
          headerName: "",
          flex: 1,
          align: "center",
          headerAlign: "center",
          sortable: false,
          hideable: false,
          renderCell: (rows) => {
            const onClick = (e) => {
              e.stopPropagation();

              this.setState({
                openDeleteDialog: true,
                selectedBadge: rows.row,
              });
            };
            return (
              <Button
                variant="outlined"
                color="error"
                onClick={onClick}
                startIcon={<Delete></Delete>}
              >
                Supprimer
              </Button>
            );
          },
        },
      ],
    };

    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
    this.handleCloseEditDialog = this.handleCloseEditDialog.bind(this);
    this.handleChangeActivated = this.handleChangeActivated.bind(this);
  }

  /**
   * donne une valeur a this.state.row lorsque props est chargé
   */
  componentDidUpdate(prevState) {
    if (this.state.rows.length == 0 || this.props.rows != prevState.rows) {
      this.setState({ rows: this.props.rows.map((row) => ({ ...row })) });
    }

  }
  

  /**
   * Fait un appelle à la base de données pour changer l'activation d'un badge
   * Est appeler lorsqu'un "switch" est coché
   * Code partiellement généré par : OpenAI. (2025). ChatGPT (version 20 mars 2025) [Modèle
   * massif de langage]. https://chat.openai.com/chat
   * @param {*} id l'id du badge
   * @param {*} activated la valeur à lui donner
   */
  handleChangeActivated = (id, activated) => {
    const oldValues = [...this.state.rows];
    this.setState((prevState) => ({
      rows: prevState.rows.map((row) =>
        row.id === id ? { ...row, activated: activated ? 0 : 1 } : row
      ),
    }));
    Api.put(
      "/badge/activation/",
      { id: id, activated: activated ? 0 : 1 },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((_) => {})
      .catch((err) => {
        this.setState({rows: oldValues});
        this.props.errorBadge("La modification de l'état a échouée")
        console.error(err);
      });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  handleCloseEditDialog = () => {
    this.setState({ openEditDialog: false });
  };

  render() {
    return (
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={this.state.rows ?? []}
          columns={this.state.columns}
          rowHeight={100}
          pageSize={this.state.pageSize}
          rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
          onPageSizeChange={(newPageSize) => {
            this.setState({ pageSize: newPageSize });
          }}
        />

        <BadgeDeleteAction
          isOpen={this.state.openDeleteDialog}
          onClose={this.handleCloseDeleteDialog}
          selectedBadge={this.state.selectedBadge}
          deleteBadge={this.props.deleteBadge}
          errorBadge={this.props.errorBadge ?? ""}
        />
        <Dialog
          fullScreen
          open={this.state.openEditDialog}
          onClose={this.handleCloseEditDialog}
          TransitionComponent={Transition}
        >
          <BadgeUpdateForm
            handleClose={this.handleCloseEditDialog}
            editBadge={this.props.editBadge}
            selectedBadge={this.state.selectedBadge}
            errorBadge={this.props.errorBadge ?? ""}
          />
        </Dialog>
      </div>
    );
  }
}

export default BadgeGrid;
