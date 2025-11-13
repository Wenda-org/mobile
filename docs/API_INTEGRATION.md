# 🔌 Integração API - Wenda Mobile

Documentação completa da integração entre o frontend mobile e os backends (Core API + ML API).

## 📁 Estrutura de Arquivos

```
mobile/
├── services/                    # Camada de serviços
│   ├── api.config.ts           # Configuração do Axios (Core + ML)
│   ├── auth.service.ts         # Autenticação e usuários
│   ├── category.service.ts     # Categorias
│   ├── destination.service.ts  # Destinos
│   ├── favorite.service.ts     # Favoritos
│   ├── review.service.ts       # Avaliações
│   ├── trip.service.ts         # Viagens
│   ├── ml.service.ts           # Machine Learning
│   └── index.ts                # Exports centralizados
├── types/
│   └── api.types.ts            # TypeScript types
├── hooks/                       # React Hooks customizados
│   ├── useDestinations.ts      # Hook para destinos
│   ├── useFavorites.ts         # Hook para favoritos
│   └── useML.ts                # Hook para ML
└── examples/
    └── ApiUsageExamples.tsx    # Exemplos de uso
```

## 🚀 Como Usar

### 1. Importar Serviços

```typescript
import {
  authService,
  destinationService,
  favoriteService,
  reviewService,
  tripService,
  mlService,
} from '@/services';
```

### 2. Fazer Requisições

#### Login
```typescript
const response = await authService.login({
  email: 'user@example.com',
  password: 'senha123'
});

if (response.success && response.data) {
  // Salvar token
  await AsyncStorage.setItem('@wenda_access_token', response.data.accessToken);
  await AsyncStorage.setItem('@wenda_user', JSON.stringify(response.data.user));
}
```

#### Listar Destinos
```typescript
const response = await destinationService.getDestinations({
  page: 1,
  perPage: 20,
  province: 'Luanda',
  sortBy: 'rating'
});

const destinations = response.data;
const pagination = response.meta;
```

#### Adicionar Favorito
```typescript
const response = await favoriteService.addFavorite({
  destinationId: 'uuid-do-destino'
});
```

#### Criar Review
```typescript
const response = await reviewService.createReview({
  destinationId: 'uuid-do-destino',
  rating: 5,
  comment: 'Lugar incrível!',
  visitDate: '2025-11-01'
});
```

#### Previsão ML
```typescript
const forecast = await mlService.forecast({
  province: 'Luanda',
  month: 12,
  year: 2025
});

console.log('Visitantes previstos:', forecast.predicted_visitors);
```

#### Recomendações ML
```typescript
const recommendations = await mlService.getRecommendations({
  user_preferences: {
    preferred_categories: ['natural', 'historical'],
    preferred_provinces: ['Luanda'],
    max_distance_km: 100
  },
  top_n: 10
});
```

### 3. Usar Hooks (Recomendado)

```typescript
import { useDestinations } from '@/hooks/useDestinations';

function MyComponent() {
  const { destinations, loading, error, fetchDestinations } = useDestinations();

  useEffect(() => {
    fetchDestinations({ province: 'Luanda' });
  }, []);

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro: {error}</Text>;

  return (
    <FlatList
      data={destinations}
      renderItem={({ item }) => <DestinationCard {...item} />}
    />
  );
}
```

## 🔧 Configuração

### URLs das APIs

As URLs estão configuradas em `services/api.config.ts`:

- **Core API**: `http://192.168.100.10:3000/api`
- **ML API**: `https://backend-ml-c75p.onrender.com/api/ml`

Para alterar, edite o arquivo:

```typescript
// services/api.config.ts
export const coreApi = axios.create({
  baseURL: 'http://SEU_IP:3000/api',
  // ...
});
```

### Autenticação Automática

O token é adicionado automaticamente em todas as requisições do Core API:

```typescript
// Interceptor já configurado
coreApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@wenda_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Tratamento de Erro 401

Quando o token expira, o usuário é automaticamente deslogado:

```typescript
coreApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@wenda_access_token');
      await AsyncStorage.removeItem('@wenda_user');
      // Redirecionar para login
    }
    return Promise.reject(error);
  }
);
```

## 📚 Tipos TypeScript

Todos os tipos estão em `types/api.types.ts`:

```typescript
import type {
  User,
  Destination,
  Review,
  Trip,
  Favorite,
  Category,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api.types';
```

## 🎯 Serviços Disponíveis

### Core API (Backend Principal)

| Serviço | Métodos | Descrição |
|---------|---------|-----------|
| `authService` | `login`, `register`, `getProfile`, `updateProfile` | Autenticação e perfil |
| `destinationService` | `getDestinations`, `getDestinationById` | Destinos turísticos |
| `categoryService` | `getCategories`, `getCategoryById` | Categorias |
| `favoriteService` | `getFavorites`, `addFavorite`, `removeFavorite`, `checkFavorite` | Favoritos |
| `reviewService` | `getReviews`, `createReview`, `updateReview`, `deleteReview`, `markAsHelpful` | Avaliações |
| `tripService` | `getTrips`, `createTrip`, `updateTrip`, `deleteTrip`, `addDestination`, `removeDestination` | Viagens |

### ML API (Machine Learning)

| Serviço | Métodos | Descrição |
|---------|---------|-----------|
| `mlService` | `healthCheck`, `getModels` | Status e modelos |
| `mlService` | `forecast` | Previsão de visitantes |
| `mlService` | `getRecommendations` | Recomendações personalizadas |
| `mlService` | `getSegmentation` | Segmentação de usuários |

## 🔍 Tratamento de Erros

### Padrão Try-Catch

```typescript
try {
  const response = await destinationService.getDestinations();
  if (response.success) {
    setDestinations(response.data);
  }
} catch (err: any) {
  const errorMessage = err.response?.data?.message || 'Erro desconhecido';
  Alert.alert('Erro', errorMessage);
}
```

### Com useState

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await destinationService.getDestinations();
    // processar dados
  } catch (err: any) {
    setError(err.response?.data?.message || 'Erro ao carregar');
  } finally {
    setLoading(false);
  }
};
```

## 🧪 Testando a Integração

### 1. Verificar Core API

```bash
# No terminal do backend
curl http://192.168.100.10:3000/api/destinations
```

### 2. Verificar ML API

```bash
curl https://backend-ml-c75p.onrender.com/api/ml/health
```

### 3. Testar no App

```typescript
// Adicionar em qualquer componente
useEffect(() => {
  const test = async () => {
    try {
      const destinations = await destinationService.getDestinations();
      console.log('✅ Core API OK:', destinations.data.length, 'destinos');
      
      const health = await mlService.healthCheck();
      console.log('✅ ML API OK:', health.status);
    } catch (err) {
      console.error('❌ Erro:', err);
    }
  };
  test();
}, []);
```

## 📱 Exemplos Práticos

Veja exemplos completos em `examples/ApiUsageExamples.tsx`:

- ✅ Login e Registro
- ✅ Listagem de Destinos com Paginação
- ✅ Detalhes de Destino
- ✅ Sistema de Favoritos
- ✅ Criar e Listar Reviews
- ✅ Gerenciar Viagens
- ✅ Previsão de Visitantes (ML)
- ✅ Recomendações Personalizadas (ML)
- ✅ Listar Categorias

## 🚨 Troubleshooting

### Erro de Conexão

```
Network Error / ECONNREFUSED
```

**Solução:**
1. Verificar se o backend está rodando
2. Verificar o IP correto (192.168.100.10)
3. Testar com `curl` ou Postman

### Token Inválido (401)

```
Unauthorized / Token expired
```

**Solução:**
1. Fazer login novamente
2. Verificar se o token está sendo salvo corretamente
3. Limpar AsyncStorage: `AsyncStorage.clear()`

### CORS Error

**Solução:**
1. Configurar CORS no backend
2. Adicionar IP do dispositivo nas origens permitidas

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os exemplos em `examples/ApiUsageExamples.tsx`
2. Consulte a documentação da API em `docs/`
3. Verifique os logs do console

---

**Desenvolvido com ❤️ pela equipe Wenda**
