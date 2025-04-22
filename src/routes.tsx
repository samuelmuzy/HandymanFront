import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginSceen } from "./screens/LoginSceen";
import { HomeScreen } from "./screens/HomeScenn";
import { SecurityPage } from "./screens/SecurityPage";

export const Router = () =>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeScreen/>}/>
                <Route path="/login" element={<LoginSceen/>}/>  
                <Route path="/seguro" element={<SecurityPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}