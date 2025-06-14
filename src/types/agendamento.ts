export interface AgendamentoType {
  id_usuario: string;
  id_fornecedor: string;
  categoria: string;
  data: Date;
  horario: Date;
  status: string;
  id_pagamento?: string;
  id_avaliacao?: string;
  descricao: string;
} 

export interface Solicitacao {
  servico: {
      id_servico: string;
      categoria: string;
      data: Date;
      horario: Date;
      data_submisao: Date
      status: string;
      descricao: string;
      id_pagamento?: string;
      id_avaliacao?: string;
  };
  usuario: {
      id_usuario: string;
      nome: string;
      email: string;
      telefone: string;
      picture: string;
  } | null;
}
