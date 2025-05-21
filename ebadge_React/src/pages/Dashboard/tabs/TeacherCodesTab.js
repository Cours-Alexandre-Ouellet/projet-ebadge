import React, { useEffect, useState } from "react";
import Api from "../../../utils/Api";
import Item from "@mui/material/Grid";
import { Button, Snackbar, Alert } from "@mui/material";
import "./../Dashboard.css";
import { Add } from "@mui/icons-material";
import TeacherCodeGrid from "../../../composant/Dashboard/TeacherCodeGrid";
import Loading from "../../../composant/Loading/LoadingComponent";

export default function TeacherCodesTab() {
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [teacherCodes, setTeacherCodes] = useState([]);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    getTeacherCodes();
  }, []);

  /**
   * Récupère la liste des codes
   */
  const getTeacherCodes = () => {
    Api.get("/teacher-code").then(({ data }) => {
      const { teacher_codes } = data;
      setTeacherCodes(teacher_codes);
      setCharge(true);
    });
  };

  /**
   * Assigne un code enseignant à un utilisateur
   * @param {Number} teacherCodeId
   * @param {Number} userId
   */
  const assignTeacherCode = (teacherCodeId, userId) => {
    Api.put("/teacher-code", {
      data: { user_id: userId, teacher_code_id: teacherCodeId },
    }).then(({ data }) => {
      const { teacher_codes } = data;
      setTeacherCodes(teacher_codes);
    });

    setSuccessMessage("Le code enseignant a été assigné avec succès !");
    setShowSuccessMessage(true);
  };

  /**
   * Supprime un code enseignant
   * @param {String} teacherCode
   */
  const deleteTeacherCode = (teacherCode) => {
    Api.delete("/teacher-code", { data: { code: teacherCode } }).then(() => {
      getTeacherCodes();
      setSuccessMessage("Le code enseignant a été supprimé avec succès !");
      setShowSuccessMessage(true);
    });
  };

  /**
   * Affiche un message d'erreur
   * @param {String} message
   */
  const handleErrorTeacherCode = (message) => {
    setErrorMessage(message);
    setShowErrorMessage(true);
  };

  /**
   * Ferme le message de succès
   */
  const handleCloseSuccessMessage = () => {
    setErrorMessage("");
    setShowErrorMessage(false);
  };

  /**
   * Ferme le message d'erreur
   */
  const handleCloseErrorMessage = () => {
    setErrorMessage("");
    setShowErrorMessage(false);
  };

  /**
   * Génère un code enseignant
   */
  const handleGenerateTeacherCode = () => {
    Api.post("/teacher-code").then(() => {
      getTeacherCodes();
    });
  };

  return (
    <Item className="bordered">
      <div className="title">
        <h4>Liste des codes enseignants</h4>
        <Button
          variant="contained"
          onClick={handleGenerateTeacherCode}
          startIcon={<Add></Add>}
        >
          Générer un code enseignant
        </Button>
      </div>
      <div>
        <TeacherCodeGrid
          rows={teacherCodes}
          refresh={getTeacherCodes}
          deleteTeacherCode={deleteTeacherCode}
          assignTeacherCode={assignTeacherCode}
          errorTeacherCodeHandler={handleErrorTeacherCode}
        />
        <Snackbar
          onClose={handleCloseSuccessMessage}
          open={showSuccessMessage}
          autoHideDuration={3000}
        >
          <Alert
            onClose={handleCloseSuccessMessage}
            severity="success"
            sx={{ width: "100%" }}
            md={{ minWidth: "300px" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          onClose={handleCloseErrorMessage}
          open={showErrorMessage}
          autoHideDuration={3000}
        >
          <Alert
            onClose={handleCloseErrorMessage}
            severity="error"
            sx={{ width: "100%" }}
            md={{ minWidth: "300px" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </div>
      {charge ? <hr></hr> : <Loading />}
    </Item>
  );
}
