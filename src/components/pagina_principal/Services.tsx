import { useEffect, useState } from 'react';
import axios from 'axios';

interface Categoria {
  _id: string;
  nome: string;
  descricao: string;
}

interface Fornecedor {
  _id: string;
  nome: string;
  descricao: string;
  categoria_servico: string[];
}

export default function Services() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/servicos/categorias').then(res => {
      setCategorias(res.data);
    });
  }, []);

  useEffect(() => {
    if (categoriaSelecionada) {
      axios.get(`http://localhost:3000/api/servicos/fornecedores/${categoriaSelecionada}`).then(res => {
        setFornecedores(res.data);
      });
    }
  }, [categoriaSelecionada]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nossos Serviços</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categorias.map(categoria => (
          <div
            key={categoria._id}
            className="border p-4 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => setCategoriaSelecionada(categoria._id)}
          >
            <h2 className="text-xl font-semibold">{categoria.nome}</h2>
            <p>{categoria.descricao}</p>
          </div>
        ))}
      </div>

      {categoriaSelecionada && (
        <>
          <h2 className="text-xl font-bold mt-6">Prestadores Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {fornecedores.map(f => (
              <div key={f._id} className="border p-4 rounded">
                <h3 className="font-semibold">{f.nome}</h3>
                <p>{f.descricao}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}