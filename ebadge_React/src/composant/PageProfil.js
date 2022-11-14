import React from 'react';
import './pageProfil.css';
class PageProfil extends React.Component {
    render() {
        return (
            <div>
                <div className='profil'>
                    <div>
                        <img src='https://www.w3schools.com/howto/img_avatar.png' alt='Avatar' className='avatar'/>
                    </div>
                    <div className='infosUser'>
                        <p>Nom d'utilisateur</p>
                        <p># de groupe</p>
                        <div>
                            <label>Compte privé :<input type="checkbox" className='checkbox'/></label>
                        </div>
                        <button className='button'>Modifier le fond d'écran</button>
                    </div>
                    <div class="infosLevel">
                        <p>Level : 1</p>
                        <div class="progressBar">
                            <div class="progressBarFill"></div>
                        </div>
                    </div>
                </div>
                <div className='BadgeArray'>
                    <div className='rowBadge'>
                        <div className='Badge'>
                            <img src='https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif' alt='badge' className='badgeIcon'/>
                            <div class="hide">
                                <p  className='textBadge'><strong>Badge 1</strong></p>
                                <p>description du badge 1</p>
                                <p>Pourcentage d'obtention : {'50%'}</p>
                            </div>
                        </div>
                        <div className='Badge'>
                            <img src='https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif' alt='badge' className='badgeIcon'/>
                            <div class="hide">
                                <table>
                                    <tr>
                                        <th>Titre</th>
                                        <th>Date d'attribution</th>
                                        <th>Rareté</th>
                                    </tr>
                                    <tr>
                                        <td>Among Us</td>
                                        <td>23/07/03</td>
                                        <td>0.2%</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div className='Badge'>
                            <img src='https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif' alt='badge' className='badgeIcon'/>
                            <div class="hide">
                                <table>
                                    <tr>
                                        <th>Titre</th>
                                        <th>Date d'attribution</th>
                                        <th>Rareté</th>
                                    </tr>
                                    <tr>
                                        <td>Among Us</td>
                                        <td>23/07/03</td>
                                        <td>0.2%</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div className='Badge'>
                            <img src='https://www.gifcen.com/wp-content/uploads/2022/01/meme-gif-3.gif' alt='badge' className='badgeIcon'/>
                            <div class="hide">
                                <table>
                                    <tr>
                                        <th>Titre</th>
                                        <th>Date d'attribution</th>
                                        <th>Rareté</th>
                                    </tr>
                                    <tr>
                                        <td>Among Us</td>
                                        <td>23/07/03</td>
                                        <td>0.2%</td>
                                    </tr>
                                </table>
                            </div>
                        </div>        
                    </div>
                </div>
            </div>
        );
    }
}

export default (PageProfil);
