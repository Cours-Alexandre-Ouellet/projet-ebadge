import React, { useState, useEffect } from "react";

import "./BadgeAchievementPopup.css";
import { Button, DialogActions } from "@mui/material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Confetti from "react-confetti";
import { Fireworks } from "@fireworks-js/react";
import Api from "../../../../utils/Api";
import BadgeComponent from "../../../PageProfil/BadgeComponent";
import Carousel from "react-material-ui-carousel";

export default function BadgeAchievementPopup() {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const [isOpen, setIsOpen] = useState(false);
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        getNewBadges();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (badges.length > 0) {
            setIsOpen(true);
        }
    }, [badges]);

    /**
     * Recherche les derniers badges assignés à l'étudiant
     */
    const getNewBadges = () => {
        Api.get("/user/new-badges")
            .then((res) => {
                const newBadges = res.data ?? [];
                setBadges(newBadges);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    /**
     *  Notifie le système que l'étudiant a vu le(s) nouveau(x) badge(s)
     */
    const notifyBadgesSeen = () => {
        if (badges.length === 0) return;

        Api.put("/user/new-badges/seen", { ids: badges.map((b) => b.id) })
            .then(() => {
                getNewBadges();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onClose = () => {
        setIsOpen(false);
        notifyBadgesSeen();
    };

    return (
        <div className="badge-achievement-popup-container" style={{ display: isOpen ? "block" : "none" }}>
            <Confetti
                className={`confetti-wrapper ${isOpen ? "active" : ""}`}
                width={width}
                height={height}
            />
            <Fireworks
                style={{
                    display: isOpen ? "block" : "none",
                    position: "absolute",
                    zIndex: 1000,
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                }}
            />
            <Dialog
                open={isOpen}
                onClose={onClose}
                className="badge-achievement-popup"
            >
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    {`Vous avez reçu ${badges.length > 1 ? "des nouveaux badges !" : "un nouveau badge !"
                        }`}
                </DialogTitle>
                <DialogContent>
                    <Carousel
                        navButtonsAlwaysVisible
                        navButtonsAlwaysInvisible={badges.length < 2}
                        indicators={false}
                        autoPlay
                        stopAutoPlayOnHover
                        animation="fade"
                        className="badge-achievement-carousel"
                    >
                        {badges.map((badge) => (
                            <div className="badge-achievement-carousel-badge" key={badge.id}>
                                <BadgeComponent badge={badge} />
                                <h3>{badge.title}</h3>
                            </div>
                        ))}
                    </Carousel>
                </DialogContent>
                <DialogActions>
                    <Button className={"mt-2"} variant="outlined" onClick={onClose} style={{ display: 'block', margin: '0 auto' }}>
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}