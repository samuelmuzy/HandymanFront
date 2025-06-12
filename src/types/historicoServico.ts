export type HistoricoServico  = {
    id_servico: string;
    id_usuario: string;
    id_fornecedor:string
    categoria: string;
    data: Date;
    horario: Date;
    data_submisao: Date;
    status: string;
    id_pagamento?: string;
    id_avaliacao?: string;
    descricao: string;
    fornecedor: {
        nome: string;
        email: string;
        telefone: string;
        categoria_servico: string[];
        media_avaliacoes: number;
        imagemPerfil: string;
    } | null;
}