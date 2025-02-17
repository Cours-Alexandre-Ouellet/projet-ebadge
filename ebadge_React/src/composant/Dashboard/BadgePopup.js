import React, { useEffect, useState } from "react";
import "./ListeBadgesPopup.css";

import { Avatar, Typography } from "@mui/material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Divider from '@mui/material/Divider';
import { getResource } from "../../utils/Api";

/**
 * Popup affichant le badge sélectionné par l'utilisateur
 */
export default function BadgePopup({ isOpen, handleClose, selectedBadge }){
  const [titre, setTitre] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescriiption] = useState("");

  useEffect(() => {
    setTitre(selectedBadge ? selectedBadge.title : "");
    setImage(selectedBadge ? selectedBadge.imagePath : "");
    setDescriiption(selectedBadge ? selectedBadge.description : "");
  }, [selectedBadge]);

  return (
    <Dialog open={isOpen ?? false} onClose={handleClose} className="dialog-principale">
      <DialogTitle
        sx={{ fontSize: 45}}
      >
        {titre}
      </DialogTitle>
      <DialogContent className="dialog-popup">
        <Avatar alt={titre} src={image || getResource("badge.png")} className="avatar" />
        <Divider/>
        <Typography className="description">{description}</Typography>
      </DialogContent>
    </Dialog>
  );
};

