import { useEffect, useState } from "react";
import {
  FormControl,
  TextField,
  Button,
  Avatar,
  Autocomplete,
} from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { Alert, Snackbar } from "@mui/material";
import Api from "../../../utils/Api";

export default function BadgeAssignationPopup({
  isOpen,
  onClose,
  defaultBadge,
  defaultUser,
}) {
  const [usersLeft, setUsersLeft] = useState([]);
  const [usersSelected, setUsersSelected] = useState([]);

  const [badgesLeft, setBadgesLeft] = useState([]);
  const [badgesSelected, setBadgesSelected] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBadges, setLoadingBadges] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  /**
   * Trouve tous les badges qui peuvent être assignés aux utilisateurs
   */
  useEffect(() => {
    if (!isOpen) return;

    refreshBadges();
  }, [isOpen]);

  /**
   * Trouve tous les badges qui peuvent être assignés aux utilisateurs
   */
  useEffect(() => {
    if (!isOpen) return;

    refreshUsers();
  }, [isOpen, badgesSelected]);

  /**
   * Assigne un badge par défaut
   */
  useEffect(() => {
    if (defaultBadge) {
      setBadgesSelected((prev) => [...prev, defaultBadge]);
    }
  }, [defaultBadge]);

  /**
   * Assigne un utilisateur par défaut
   */
  useEffect(() => {
    if (defaultUser) {
      setUsersSelected((prev) => [...prev, defaultUser]);
    }
  }, [defaultUser]);

  /**
   * Trouve tous les badges qui peuvent être assignés aux utilisateurs
   */
  const refreshBadges = () => {
    setLoadingBadges(true);

    Api.get("/badge/all-active")
      .then((response) => {
        setBadgesLeft(response.data.badges);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingBadges(false);
      });
  };

  /**
   * Trouve tous les utilisateurs à qui peuvent être assignés les badges
   */
  const refreshUsers = () => {
    setLoadingUsers(true);

    Api.get("/user/without-badges", {
      params: {
        badge_ids: badgesSelected.map((badge) => badge.id) || [],
      },
    })
      .then((response) => {
        if (response.data.users) {
          setUsersLeft(response.data.users);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  };

  /**
   * Ferme la fenêtre et réinitialise les valeurs
   */
  const handleClose = () => {
    setBadgesSelected([]);
    setUsersSelected([]);
    onClose();
  };

  /**
   * Fait la soumission des assignations
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    Api.post("/user/assign-multiple-badges", {
      badge_ids: badgesSelected.map((badge) => badge.id) || [],
      user_ids: usersSelected.map((user) => user.id) || [],
    })
      .then(() => {
        const userPart =
          usersSelected.length > 1
            ? " aux utilisateurs sélectionnés"
            : " à l'utilisateur sélectionné";
        const message =
          badgesSelected.length > 1
            ? `Les badges ont été assignés avec succès ${userPart} !`
            : `Le badge a été assigné avec succès ${userPart} !`;

        setSuccessMessage(message);
        setShowSuccessMessage(true);
        handleClose();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setBadgesSelected([]);
        setUsersSelected([]);
      });
  };

  /**
   * Contrôle la sélection d'un badge
   */
  const handleChangeBadges = (newValue) => {
    setBadgesSelected(newValue);
    setUsersSelected([]);
  };

  /**
   * Contrôle la sélection d'un utilisateur
   */
  const handleChangeUsers = (newValue) => {
    setUsersSelected(newValue);
  };

  // Fonction qui permet de fermer le message de succès
  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Assignation des badges</DialogTitle>
        <DialogContent className={"badge-popup"}>
          <DialogContentText>
            <form>
              <FormControl fullWidth sx={{ gap: "20px" }}>
                <Autocomplete
                  multiple
                  id="badge-select"
                  options={badgesLeft}
                  value={badgesSelected}
                  getOptionLabel={(option) => option.title}
                  loading={loadingBadges}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <div className="badge-row">
                        <Avatar
                          className="badge"
                          alt={option.title}
                          src={option.imagePath}
                          sx={{
                            boxShadow: `0 0 4px 8px ${option.category_color}`,
                            marginRight: "8px",
                          }}
                        />
                        {option.title}
                      </div>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Badge(s) à assigner" />
                  )}
                  onChange={(_, newValue) => {
                    handleChangeBadges(newValue);
                  }}
                />
                <Autocomplete
                  multiple
                  id="user-select"
                  options={usersLeft}
                  value={usersSelected}
                  getOptionLabel={(option) =>
                    option.first_name + " " + option.last_name
                  }
                  loading={loadingUsers}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <div className="user-row">
                        {option.first_name + " " + option.last_name}
                      </div>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Utilisateur(s) à affecter" />
                  )}
                  onChange={(_, newValue) => {
                    handleChangeUsers(newValue);
                  }}
                />
                <Button
                  variant="contained"
                  className={"mt-2"}
                  onClick={handleSubmit}
                >
                  Confirmer l'assignation
                </Button>
              </FormControl>
            </form>
          </DialogContentText>
        </DialogContent>
      </Dialog>
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
    </>
  );
}
