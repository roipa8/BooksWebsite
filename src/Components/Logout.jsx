import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GetAuth, GetUserId } from "../Contexts/AuthContext";
import { GetBooks } from "../Contexts/BooksContext";

function Logout() {
    const navigate = useNavigate();
    const {setIsAuthenticated} = GetAuth();
    const {setUserId} = GetUserId();
    const {setBooks} = GetBooks();
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
                    setBooks([]);
                    navigate("/");
                }
            } catch (error) {
                console.error(error);
            }
        }
        logout();
    }, [navigate, setIsAuthenticated, setUserId, setBooks]);
    return null;
};

export default Logout;
