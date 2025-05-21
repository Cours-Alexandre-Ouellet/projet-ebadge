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
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categoryColor, setCategoryColor] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    setTitle(selectedBadge ? selectedBadge.title : "");
    setImage(selectedBadge ? selectedBadge.imagePath : "");
    setDescription(selectedBadge ? selectedBadge.description : "");
    setCategoryColor(selectedBadge ? selectedBadge.category_color : "");
    setCategoryName(selectedBadge ? selectedBadge.category_name : "");
  }, [selectedBadge]);

  return (
    <Dialog open={isOpen ?? false} onClose={handleClose} className="dialog-principal">
      <DialogTitle
        sx={{ fontSize: 45}}
      >
        {title}
      </DialogTitle>

      <Typography 
        className="category" 
        sx={{ 
          textAlign: 'center',
          marginTop: '0 !important',
          marginBottom: '16px !important',
          boxShadow: `0 0 12px 8px ${categoryColor}`,
        }}
      >
        Catégorie: {categoryName || "Non catégorisé"}
      </Typography>

      <DialogContent className="dialog-popup">

        <Avatar alt={title} src={image || getResource("badge.png")} className="avatar" sx={{ boxShadow: `0 0 8px 12px ${categoryColor}` }}/>

        <Divider/>

        <Typography className="description">
          {description}
        </Typography>
        
      </DialogContent>
    </Dialog>
  );
};

