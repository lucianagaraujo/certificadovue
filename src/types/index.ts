export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'aluno';
  created_at?: Date;
}

export interface Medalha {
  id: string;
  nome: string;
  descricao: string;
  criterios: string;
  imagem_url: string;
  data_conquista?: string;
  created_at?: Date;
}

export interface AlunoMedalha {
  id: string;
  aluno_id: string;
  medalha_id: string;
  data_vincular: Date;
} 