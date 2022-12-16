import Role from './Role';

export default class PoliciesHelper {


    constructor() {
        this.currentRoles = this.getCurrentRole();
    }

    /**
     * Vérifie si l'utilisateur actuel a le role minimum requis
     * 
     * @param {*} minimumRole 
     * @returns true si l'utilisateur a le role minimum requis, false sinon
     */
    hasRole(minimumRole) {
        //verifie si le role exist
        if (!this.isRoleExist(minimumRole)) {
            console.error('Role not found');
            return false;
        }

        if (this.currentRoles.indexOf(minimumRole) !== -1) {
            return true;
        }
        return false;
    }

    isRoleExist(role) {
        return Object.values(Role).indexOf(role) !== -1;
    }

    /**
     * Obtien le role de l'utilisateur actuel en localstorage ou retourne 'guest' si aucun role n'est trouvé
     * 
     * @returns {Array} list of roles
     */
    getCurrentRole() {
        let role = localStorage.getItem('role');

        if (role === null) {

            if (localStorage.getItem('token') != null) {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
            }
            return role = Role.Guest;
        }

        if (!this.isRoleExist(role)) {
            console.error('Role not found');
            role = Role.Guest;
        }

        switch (role) {
            case Role.Admin:
                return Object.values(Role);
            case Role.Teacher:
                return [Role.User, Role.Teacher];
            default:
                return [role];
        }
    }

    /**
     * 
     * @param {*} routes liste objet dont un attribut 'minimumRole' est requis
     */
    getvisibleRoutes(routes) {
        let visibleRoutes = [];

        for (let i = 0; i < routes.length; i++) {
            if (this.hasRole(routes[i].minimumRole)) {
                visibleRoutes.push(routes[i]);
            }
        }
        return visibleRoutes;
    }

    getDefaultRoute() {
        if (this.hasRole(Role.Teacher)) {
            return '/admin';
        }
        else {
            return '/';
        }
    }
}