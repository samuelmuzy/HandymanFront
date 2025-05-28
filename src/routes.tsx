import { Routes, Route } from "react-router-dom";
import { LoginSceen } from "./screens/login/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SecurityPage } from "./screens/SecurityPage";
import { PaginaErro } from "./screens/PaginaErro";
import { Servicos } from "./screens/Servicos";
import { AjudaScenn } from "./screens/AjudaSceen";

import { SobreSceen } from "./screens/SobreSceen";

import { Fornecedor } from "./screens/Fornecedor";
import { PerfilScreen } from "./screens/perfil/PerfilScreen";



import { LoginFornecedorScreen } from "./screens/login/LoginFornecedorScreen";
import { CadastroScreen } from "./screens/cadastro/CadastroScreen";
import { CadastroFornecedorScreen } from "./screens/cadastro/CadastroFornecedorScreen";
import { DetalhesServicoConfirmadoScreen } from "./screens/DetalhesServicoConfirmadoScreen";
import { PagamentoScreen } from "./screens/pagamento/PagamentoScreen";
import { ConfirmacaoPagamento } from "./screens/pagamento/ConfirmacaoPagamento";
import { AgendamentoScreen } from "./screens/agendamento/AgendamentoScreen";
import { ConfirmacaoAgendamento } from "./screens/agendamento/ConfirmacaoAgendamento";


export const Router = () =>{
    return(
            <Routes>
                <Route path="/" element={<HomeScreen/>}/>
                <Route path="/login" element={<LoginSceen/>}/>
                <Route path="/login-fornecedor" element={<LoginFornecedorScreen/>}/>
                <Route path="/seguro" element={<SecurityPage/>}/>
                <Route path="/servicos" element={<Servicos/>}/>
                <Route path="/ajuda" element={<AjudaScenn/>}/>
                <Route path="/cadastro" element={<CadastroScreen/>}/>
                <Route path="/sobre-nos" element={<SobreSceen/>}/>
                <Route path="/cadastro-fornecedor" element={<CadastroFornecedorScreen/>}/>
                <Route path="/perfil-usuario/:idPerfil" element={<PerfilScreen/>}/>
                <Route path="/fornecedor/:id" element={<Fornecedor/>}/>
                <Route path="/detalhes-servico-confirmado/:id" element={<DetalhesServicoConfirmadoScreen/>}/>
                <Route path="/pagamento" element={<PagamentoScreen/>}/>
                <Route path="/pagamento/:id" element={<AgendamentoScreen/>}/>
                <Route path="/confirmaco-pagamento/:idServico" element={<ConfirmacaoPagamento/>}/>
                <Route path="/confirmacao-agendamento" element={<ConfirmacaoAgendamento />} />
                <Route path="*" element={<PaginaErro/>}/>
            </Routes>
    )
}