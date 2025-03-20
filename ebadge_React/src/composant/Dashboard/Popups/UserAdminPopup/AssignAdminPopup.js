import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Api from "../../../../utils/Api";
import "./AssignAdminPopup.css"; 

const AssignAdminPopup = ({ isOpen, handleClose, refreshAdmins }) => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchAdmins();
    }
  }, [isOpen]);

  const fetchUsers = () => {
    Api.get("/user")
      .then((res) => {
        const nonAdmins = res.data.users.filter(user => user.role_id !== 1);
        setUsers(nonAdmins);
      })
      .catch(() => setUsers([]));
  };

  const fetchAdmins = () => {
    Api.get("/user/role/1")
      .then((res) => {
        setAdmins(res.data.users);
      })
      .catch(() => setAdmins([]));
  };

  const handleAssignAdmin = () => {
    if (!selectedUser) return;

    setLoading(true);
    Api.post("/user/assign-admin", { user_id: selectedUser })
      .then(() => {
        setMessage("Utilisateur promu administrateur !");
        setTimeout(() => {
          refreshAdmins();
          fetchUsers();
          fetchAdmins();
          setMessage("");
          handleClose();
        }, 2000);
      })
      .catch(() => setMessage("Erreur lors de l'assignation."))
      .finally(() => setLoading(false));
  };

  const handleRemoveAdmin = (adminId) => {
    setLoading(true);
    Api.post("/user/remove-admin", { user_id: adminId })
      .then(() => {
        setMessage("Administrateur rétrogradé !");
        setTimeout(() => {
          refreshAdmins();
          fetchUsers();
          fetchAdmins();
          setMessage("");
        }, 2000);
      })
      .catch(() => setMessage("Erreur lors de la suppression."))
      .finally(() => setLoading(false));
  };

  const adminColumns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    // { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'first_name', headerName: 'Prénom', flex: 1 },
    { field: 'last_name', headerName: 'Nom', flex: 1 },
    {
      field: "removeAction",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => (
        <Button variant="outlined" color="error" className="assign-admin-delete-btn" sx={{ padding: '8px 16px', minWidth: '120px' }} onClick={() => handleRemoveAdmin(params.row.id)}>
          Rétrograder
        </Button>
      )
    }
  ];

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Gestion des administrateurs</DialogTitle>
      <DialogContent className="assign-admin-popup">
        {message && <p className={message.includes("Erreur") ? "error-message" : "success-message"}>{message}</p>}

        {/* Formulaire pour assigner un admin */}
        <div className="assign-admin-form">
          <FormControl fullWidth>
            <InputLabel id="user-select-label">Sélectionner un utilisateur</InputLabel>
            <Select
              labelId="user-select-label"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.length > 0 ? users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </MenuItem>
              )) : <MenuItem disabled>Aucun utilisateur disponible</MenuItem>}
            </Select>
          </FormControl>

          <Button 
            onClick={handleAssignAdmin} 
            variant="contained" 
            color="primary" 
            disabled={loading || !selectedUser}
          >
            Confirmer l'assignation
          </Button>
        </div>

        <hr />

        {/* Tableau des administrateurs */}
        <h4>Liste des administrateurs</h4>
        <DataGrid
          autoHeight={true}
          rows={admins ?? []}
          columns={adminColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          className="assign-admin-table"
        />
      </DialogContent>
      <DialogActions className="assign-admin-actions">
        <Button onClick={handleClose} variant="outlined">Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignAdminPopup;
