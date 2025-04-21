import { useNavigate } from "react-router-dom";

export const HomeScreen = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Clear any authentication tokens or user data here
        navigate("/login"); // Redirect to the login screen
    };
    return(
        <div className="min-h-screen flex items-center justify-center bg-background">
            <h1 className="text-4xl font-bold text-black cursor-pointer" onClick={handleLogin}>Home Screen</h1>
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}