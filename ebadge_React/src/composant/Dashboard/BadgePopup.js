import React, { useEffect, useState } from "react";
import "./ListeBadgesPopup.css";

import { Avatar, Typography } from "@mui/material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Divider from '@mui/material/Divider';

/**
 * Popup affichant le badge sélectionné par l'utilisateur
 */
export default function BadgePopup({ isOpen, handleClose, selectedBadge }){
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setTitle(selectedBadge ? selectedBadge.title : "");
    setImage(selectedBadge ? selectedBadge.imagePath : "");
    setDescription(selectedBadge ? selectedBadge.description : "");
  }, [selectedBadge]);

  return (
    <Dialog open={isOpen ?? false} onClose={handleClose} className="dialog-principal">
      <DialogTitle
        sx={{ fontSize: 45}}
      >
        {title}
      </DialogTitle>
      <DialogContent className="dialog-popup">
        <Avatar alt={title} src={image} className="avatar" />
        <Divider/>
        <Typography className="description">{description}</Typography>
      </DialogContent>
    </Dialog>
  );
};

