import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginSceen } from "./screens/LoginSceen";
import { HomeScreen } from "./screens/HomeScenn";

export const Router = () =>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeScreen/>}/>
                <Route path="/login" element={<LoginSceen/>}/>  
            </Routes>
        </BrowserRouter>
    )
}