import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
import { Button, Avatar, Slide, Dialog } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import BadgeDeleteAction from "./Popups/BadgeDeletePopup/BadgeDeletePopup";
import BadgeUpdateForm from "../Forms/Badge/BadgeUpdateForm";
import Api, { getResource } from "../../utils/Api";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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
          field: "id",
          headerName: "ID",
          flex: 1,
          align: "center",
          headerAlign: "center",
        },
        {
          field: "imagePath",
          headerName: "Image",
          sortable: false,
          flex: 2,
          align: "center",
          headerAlign: "center",
          renderCell: (rows) => {
            return (
              <Avatar
                alt={rows.row.title}
                src={rows.value || getResource("badge.png")}
                sx={{ width: 70, height: 70, bgcolor: `#${rows.row.color}` }}
              />
            );
          },
        },
        { field: "title", headerName: "Titre", flex: 2, headerAlign: "center" },
        {
          field: "description",
          headerName: "Description",
          flex: 4,
          headerAlign: "center",
        },
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
              <Checkbox
                checked={rows.row.activated == 1}
                onChange={() =>
                  this.handleChangeActivated(rows.row.id, rows.row.activated)
                }
              >
              </Checkbox>
              
            );
          },
        },
        {
          field: "BadgeEditAction",
          minWidth: 150,
          headerName: "",
          align: "center",
          headerAlign: "center",
          sortable: false,
          hideable: false,
          renderCell: (rows) => {
            const onClick = (e) => {
              e.stopPropagation();

              this.setState({
                openEditDialog: true,
                selectedBadge: rows.row,
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

  componentDidUpdate() {
    if (this.state.rows.length == 0) {
      this.setState({ rows: this.props.rows.map((row) => ({ ...row })) });
    }
  }

  handleChangeActivated = (id, activated) => {
    Api.put(
      "/badge/activation/",
      { id: id, activated: activated ? 0 : 1 },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        this.setState((prevState) => ({
            rows: prevState.rows.map(row =>
                row.id === id ? { ...row, activated: activated ? 0 : 1 } : row
            )
        }));
      })
      .catch((err) => {
        console.log(err);
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
