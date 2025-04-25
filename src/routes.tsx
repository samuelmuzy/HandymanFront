import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginSceen } from "./screens/LoginSceen";
import { HomeScreen } from "./screens/HomeSceen";
import { SecurityPage } from "./screens/SecurityPage";
import { PaginaErro } from "./screens/PaginaErro";
import { Servicos } from "./screens/Servicos";
import { AjudaScenn } from "./screens/AjudaSceen";
import { Cadastro } from "./screens/Cadastro";
import { SobreSceen } from "./screens/SobreSceen";

export const Router = () =>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeScreen/>}/>
                <Route path="/login" element={<LoginSceen/>}/>  
                <Route path="/seguro" element={<SecurityPage/>}/>
                <Route path="/servicos" element={<Servicos/>}/>
                <Route path="/ajuda" element={<AjudaScenn/>}/>
                <Route path="/cadastro" element={<Cadastro/>}/>
                <Route path="/sobre-nos" element={<SobreSceen/>}/>
                <Route path="*" element={<PaginaErro/>}/>
            </Routes>
        </BrowserRouter>
    )
}