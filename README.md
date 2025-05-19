# Sistema de Certificados e Medalhas Digitais

Sistema desenvolvido para gerenciar certificados e medalhas digitais para instituições de ensino, com foco em gamificação e engajamento dos alunos.

## Funcionalidades

- **Área do Administrador**
  - Upload de lista de alunos via CSV
  - Gerenciamento de medalhas digitais
  - Vinculação de medalhas aos alunos
  - Visualização de estatísticas

- **Área do Aluno**
  - Visualização de medalhas conquistadas
  - Download de certificados
  - Compartilhamento de conquistas
  - Perfil personalizado

## Tecnologias Utilizadas

- Vue.js 3
- TypeScript
- Tailwind CSS
- Pinia (Gerenciamento de Estado)
- Vue Router
- Axios
- Headless UI

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd certificados-digitais
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
certificados-digitais/
├── src/
│   ├── assets/         # Arquivos estáticos
│   ├── components/     # Componentes Vue
│   ├── router/         # Configuração de rotas
│   ├── stores/         # Stores Pinia
│   ├── views/          # Páginas da aplicação
│   └── App.vue         # Componente raiz
├── public/             # Arquivos públicos
└── package.json        # Dependências e scripts
```

## Desenvolvimento

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 