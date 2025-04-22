import React, { useState, useEffect, useRef } from "react";

import './BadgeAchievementPopup.css';
import { Button, DialogActions } from "@mui/material";
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import Confetti from 'react-confetti';
import { Fireworks } from '@fireworks-js/react';
import Api from '../../../../utils/Api';
import Carousel from 'react-material-ui-carousel'
import BadgeComponent from "../../../PageProfil/BadgeComponent";

export default function BadgeAchievementPopup() {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const [isOpen, setIsOpen] = useState(false);
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            notifyBadgesSeen();
        }
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(badges.length > 0);
    }, [badges]);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        getNewBadges();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * Cherche les nouveaux badges de l'utilisateur s'il a lieu
     */
    const getNewBadges = () => {
        Api.get('/user/new-badges')
            .then(res => {
                const newBadges = res.data ?? [];
                setBadges(newBadges);
            })
            .catch(err => {
                console.log(err);
            });
    }

    /**
     * Notifie le système que l'utilisateur a vu certains badges
     */
    const notifyBadgesSeen = () => {
        Api.put('/user/new-badges/seen', { ids: badges.map(b => b.id) })
            .then(() => {
                getNewBadges();
            })
            .catch(err => {
                console.log(err);
            });
    }

    const onClose = () => {
        getNewBadges();
        setIsOpen(false);
    };

    return (
        <div className="badge-achievement-popup-container">
            <Confetti className={`confetti-wrapper ${isOpen ? 'active' : ''}`} width={width} height={height} />
            <Fireworks style={{ display: isOpen ? 'block' : 'none', position: 'absolute', zIndex: 5000, top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    {`Vous avez reçu ${badges.length > 1 ? 'des nouveaux badges !' : 'un nouveau badge !'}`}
                </DialogTitle>
                <DialogContent>
                    <BadgeComponent badge={badges[0]} />
                </DialogContent>
                <DialogActions>
                    <Button className={"mt-2"} onClick={onClose}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
