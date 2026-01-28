src/
├── assets/             # Imagens e estilos globais
├── components/         # Componentes visuais reutilizáveis
│   ├── layout/         # Header, Navigation, LayoutWrapper
│   ├── ui/             # Botões, Cards, Inputs (Componentes menores)
│   └── features/       # Componentes específicos (CartDrawer, LoyaltyCard)
├── contexts/           # Estado Global (Carrinho, Tema, Auth)
├── data/               # Mocks (Dados falsos até o Spring Boot estar pronto)
├── hooks/              # Hooks personalizados
├── pages/              # As "Telas" principais (Menu, Perfil, Pedidos)
├── services/           # Conexão com o Spring Boot (Axios/Fetch)
└── App.jsx             # Ponto de entrada limpo