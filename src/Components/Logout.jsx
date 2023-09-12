import { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function Logout() {
    const navigate = useNavigate();
    const {setIsAuthenticated} = useContext(AuthContext);
    useEffect(() => {
        async function logout() {
            try {
                const response = await axios.post('/logout');
                if (response.data.success) {
                    setIsAuthenticated(false);
                    navigate("/");
                }
            } catch (error) {
                console.log(error);
            }
        }
        logout();
    }, [navigate, setIsAuthenticated]);
    return null;
};

export default Logout;
