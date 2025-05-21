import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import TeacherCodeAssignationPopup from './Popups/TeacherCodeAssignationPopup/TeacherCodeAssignationPopup';

const TeacherCodeGrid = ({ rows = [], deleteTeacherCode, refresh }) => {
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedTeacherCode, setSelectedTeacherCode] = useState({
    id: null,
    code: null,
    user_id: null
  });

  const [columns] = useState([
    { field: 'code', headerName: 'Code', flex: 1 },
    { field: 'user_id', headerName: 'Utilisateur assigné', flex: 1 },
    {
      field: 'deleteAction',
      headerName: '',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          deleteTeacherCode(params.row.code);
        };

        return <Button variant="outlined" onClick={onClick}>Supprimer</Button>;
      },
      flex: 1,
      hideable: false
    },
    {
      field: 'assignAction',
      headerName: '',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
          setSelectedTeacherCode(params.row);
          setOpenAssignDialog(true);
        };

        return <Button variant="outlined" onClick={onClick}>Assigner</Button>;
      },
      flex: 1,
      hideable: false
    },
  ]);

  /**
   * Fermeture de la popup d'assignation
   */
  const handleClose = () => {
    setOpenAssignDialog(false);
    refresh();
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />

      <TeacherCodeAssignationPopup
        isOpen={openAssignDialog}
        teacherCodeId={selectedTeacherCode.id}
        teacherCode={selectedTeacherCode.code}
        handleClose={handleClose} />

    </div>
  )
};

export default TeacherCodeGrid;


