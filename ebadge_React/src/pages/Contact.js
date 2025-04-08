
import React, { useEffect, useMemo, useState } from "react";

import "./Contact.css";
import "@mui/material";
import Api from '../utils/Api';
import { Link } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";

/**
 * Classe Contact qui permet d'afficher le classement des utilisateurs
 */
export default function Contact() {
  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Cherche l'administrateur du site
   */
  useEffect(() => {
    Api.get("/contact")
      .then((response) => {
        setContact(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return <div className="contact-content">
        <div className="contact-loading">
          <p>
            Chargement du représentant
          </p>
          <CircularProgress />
        </div>
      </div>;
    }

    if (!contact || contact.length === 0) {
      return (
        <div className="contact-content">
          <p>
            Aucun représentant n'est présentement désigné, veuillez revenir plus tard.
          </p>
        </div>
      )
    }

    return (
      <div className="contact-content">
        <p>
          Envoyez votre courriel en contactant notre représentant ci-dessous.
        </p>
        <Link to={`mailto:${contact.email}`}>
          <Button variant="contained" className="contact-button">
            Contacter le représentant
          </Button>
        </Link>
      </div>
    )
  }, [contact, loading]);

  return (
    <div className="contact">
      <div className="contact-container">
        <div className="contact-background">
          <div className="contact-title">
            <h1>Contactez-nous</h1>
          </div>
          {content}
        </div>
      </div>
    </div>
  );
}