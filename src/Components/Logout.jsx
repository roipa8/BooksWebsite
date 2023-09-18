import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GetAuth, GetUserId } from "./AuthContext";

function Logout() {
    const navigate = useNavigate();
    const {setIsAuthenticated} = GetAuth();
    const {setUserId} = GetUserId();
    useEffect(() => {
        async function logout() {
            try {
                const response = await axios.get('/logout');
                if (response.data.success) {
                    setIsAuthenticated(false);
                    setUserId({
                        userName: "",
                        googleId: "",
                        facebookId: ""
                    });
                    navigate("/");
                }
            } catch (error) {
                console.error(error);
            }
        }
        logout();
    }, [navigate, setIsAuthenticated, setUserId]);
    return null;
};

export default Logout;
