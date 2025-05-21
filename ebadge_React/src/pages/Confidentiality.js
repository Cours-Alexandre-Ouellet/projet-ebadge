
import "./Confidentiality.css";
import "@mui/material";

/**
 * Classe Contact qui permet d'afficher le classement des utilisateurs
 */
export default function Confidentiality() {
  return (
    <div className="confidentiality">
      <div className="confidentiality-container">
        <div className="confidentiality-background">
          <div className="confidentiality-title">
            <h1>Politique de confidentialité</h1>
          </div>
          <div className="confidentiality-content">
            <h1>Collecte et utilisation des renseignements personnels</h1>
            <p>
              Le site web d'Ebadge (<a href="https://ebadge.cegepvicto.ca">https://ebadge.cegepvicto.ca</a>), nommé ci-après « service », collecte et utilise les renseignements personnels suivants :
            </p>
            <ul>
              <li>Nom</li>
              <li>Prénom</li>
              <li>Programme d'étude</li>
              <li>Année d'étude</li>
              <li>Adresse courriel</li>
            </ul>
            <p>
              Ces renseignements servent à vous identifier dans la plateforme EBadge afin que le personnel enseignant puisse vous créditer des badges.
            </p>
            <p>
              L'utilisation de la plateforme est facultative et le refus de souscrire n'a aucun impact sur votre réussite scolaire.
            </p>

            <h2>Accès aux renseignements</h2>
            <p>
              Toute personne ayant accès aux renseignements est soumise à la Loi sur l'accès aux documents des organismes publics et sur la protection des renseignements personnels, à la Politique de protection des renseignements personnels du Cégep ou à une entente de confidentialité, le cas échéant.
            </p>

            <h2>Consultation et rectification des renseignements personnels</h2>
            <p>
              Chaque personne qui utilise le service peut consulter ses renseignements personnels et demander leur rectification au besoin comme le prévoit la loi.
            </p>
            <p>
              Pour se prémunir de ce droit, il faut présenter une demande à l'administration du site : <a href="/contactez-nous" target="_blank">https://ebadge.cegepvicto.ca/contactez-nous</a>.
            </p>

            <h2>Destruction des renseignements personnels</h2>
            <p>
              Après une période d'une année d'inactivité, votre compte sera supprimé et vos renseignements personnels seront détruits.
            </p>
            <p>
              En tout temps, il est possible de demander la destruction de vos renseignements personnels en écrivant à l'administration du site : <a href="/contactez-nous" target="_blank">https://ebadge.cegepvicto.ca/contactez-nous</a>. La destruction de vos renseignements personnels peut vous empêcher d'utiliser le service.
            </p>

            <h2>Politique des renseignements personnels</h2>
            <p>
              La Politique de protection des renseignements personnels du Cégep de Victoriaville s'applique aux opérations du présent service.
            </p>

            <h2>Questions</h2>
            <p>
              Pour toute question sur le présent énoncé, vous êtes invité à communiquer avec l'administration du site : <a href="/contactez-nous" target="_blank">https://ebadge.cegepvicto.ca/contactez-nous</a>.
            </p>
          </div>
        </div>
      </div>
    </div >
  );
}