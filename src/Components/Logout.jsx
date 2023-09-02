import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();
    useEffect(() => {
        async function logout() {
            try {
                const response = await axios.post('/logout');
                if (response.data.success) {
                    navigate("/");
                }
            } catch (error) {
                console.log(error);
            }
        }

        logout();
    }, [navigate]);
    return null;
};

export default Logout;
