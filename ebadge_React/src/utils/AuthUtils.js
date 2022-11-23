import { AuthRequest } from "./Api"

export const isLogin = async () => {
    if (localStorage.getItem('token')) {
        try {
            let response = await AuthRequest.get('/auth/current_user');
            console.log(response);
            if (response.status === 200) {
                return true
            }
        } catch (error) {
            return false;
        }   
    }
    return false;
}

export const logout = () => {
    if(isLogin()){
        AuthRequest.get('/auth/logout');
    }
    localStorage.removeItem('token');

}
