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