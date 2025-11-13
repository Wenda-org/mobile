# 📦 Integração API - Wenda Mobile

## ✅ O que foi implementado

### 🔧 Configuração Base
- ✅ Axios instalado e configurado
- ✅ Duas instâncias de API (Core + ML)
- ✅ Interceptors para autenticação automática
- ✅ Tratamento de erros 401 (token expirado)
- ✅ TypeScript com tipos completos

### 📁 Estrutura de Arquivos Criada

```
mobile/
├── services/                       # 🔌 Camada de serviços
│   ├── api.config.ts              # Configuração Axios (Core + ML)
│   ├── auth.service.ts            # Login, registro, perfil
│   ├── category.service.ts        # Categorias de destinos
│   ├── destination.service.ts     # Destinos turísticos
│   ├── favorite.service.ts        # Sistema de favoritos
│   ├── review.service.ts          # Avaliações
│   ├── trip.service.ts            # Viagens
│   ├── ml.service.ts              # Machine Learning (forecast, recommendations)
│   └── index.ts                   # Exports centralizados
│
├── types/
│   └── api.types.ts               # 📝 Tipos TypeScript (User, Destination, etc)
│
├── hooks/                          # 🪝 React Hooks customizados
│   ├── useDestinations.ts         # Hook para destinos
│   ├── useFavorites.ts            # Hook para favoritos
│   └── useML.ts                   # Hook para ML (forecast, recommendations)
│
├── components/
│   └── ApiTestButton.tsx          # 🧪 Botão de teste (DEV)
│
├── tests/
│   └── apiIntegrationTest.ts      # 🧪 Testes automatizados
│
├── examples/
│   └── ApiUsageExamples.tsx       # 📚 Exemplos de código
│
└── docs/
    ├── API_INTEGRATION.md          # 📖 Documentação completa
    ├── QUICK_START.md              # 🚀 Guia rápido
    ├── API_QUICK_REFERENCE.md      # 📋 Referência rápida (já existia)
    ├── API_DOCUMENTATION.md        # 📋 Documentação (já existia)
    ├── API_USAGE_GUIDE.md          # 📋 Guia de uso (já existia)
    ├── api.types.ts                # 📋 Tipos (já existia)
    └── GUIA-TESTES-ENDPOINTS.md    # 📋 Guia ML (já existia)
```

## 🎯 Serviços Disponíveis

### Core API (192.168.100.10:3000)

#### 🔐 authService
```typescript
await authService.login({ email, password })
await authService.register({ name, email, password, confirmPassword })
await authService.getProfile()
await authService.updateProfile({ name, phone })
```

#### 🏝️ destinationService
```typescript
await destinationService.getDestinations({ page: 1, perPage: 20, province: 'Luanda' })
await destinationService.getDestinationById(id)
```

#### 🏷️ categoryService
```typescript
await categoryService.getCategories()
await categoryService.getCategoryById(id)
```

#### ❤️ favoriteService
```typescript
await favoriteService.getFavorites()
await favoriteService.addFavorite({ destinationId })
await favoriteService.removeFavorite(id)
await favoriteService.checkFavorite(destinationId)
```

#### ⭐ reviewService
```typescript
await reviewService.getReviews({ page: 1, perPage: 10 })
await reviewService.getReviewsByDestination(destinationId)
await reviewService.createReview({ destinationId, rating, comment })
await reviewService.updateReview(id, { rating, comment })
await reviewService.deleteReview(id)
await reviewService.markAsHelpful(id)
```

#### ✈️ tripService
```typescript
await tripService.getTrips()
await tripService.getTripById(id)
await tripService.createTrip({ title, startDate, endDate })
await tripService.updateTrip(id, { title })
await tripService.deleteTrip(id)
await tripService.addDestination(tripId, { destinationId, visitDate })
await tripService.removeDestination(tripId, destinationId)
```

### ML API (backend-ml-c75p.onrender.com)

#### 🤖 mlService
```typescript
await mlService.healthCheck()
await mlService.getModels()
await mlService.forecast({ province: 'Luanda', month: 12, year: 2025 })
await mlService.getRecommendations({ 
  user_preferences: { 
    preferred_categories: ['natural'],
    preferred_provinces: ['Luanda']
  },
  top_n: 10
})
await mlService.getSegmentation(userId)
```

## 🚀 Como Usar

### 1. Importar Serviços

```typescript
import {
  authService,
  destinationService,
  favoriteService,
  mlService
} from '@/services';
```

### 2. Usar em Componentes

```typescript
// Exemplo: Listar destinos
const [destinations, setDestinations] = useState([]);

useEffect(() => {
  const load = async () => {
    const response = await destinationService.getDestinations({
      page: 1,
      perPage: 20
    });
    setDestinations(response.data);
  };
  load();
}, []);
```

### 3. Usar Hooks (Recomendado)

```typescript
import { useDestinations } from '@/hooks/useDestinations';

const { destinations, loading, fetchDestinations } = useDestinations();

useEffect(() => {
  fetchDestinations({ province: 'Luanda' });
}, []);
```

## 🧪 Testar a Integração

### Opção 1: Botão de Teste Visual

```typescript
// Adicione em qualquer tela (desenvolvimento)
import ApiTestButton from '@/components/ApiTestButton';

export default function MyScreen() {
  return (
    <View>
      {__DEV__ && <ApiTestButton />}
    </View>
  );
}
```

### Opção 2: Teste Programático

```typescript
import { runAllTests } from '@/tests/apiIntegrationTest';

useEffect(() => {
  if (__DEV__) {
    runAllTests();
  }
}, []);
```

### Opção 3: Teste Manual

```bash
# Terminal 1: Verificar Core API
curl http://192.168.100.10:3000/api/destinations

# Terminal 2: Verificar ML API
curl https://backend-ml-c75p.onrender.com/api/ml/health
```

## 📚 Documentação

- **Início Rápido:** `docs/QUICK_START.md`
- **Integração Completa:** `docs/API_INTEGRATION.md`
- **Exemplos de Código:** `examples/ApiUsageExamples.tsx`
- **Referência API:** `docs/API_QUICK_REFERENCE.md`
- **Guia ML:** `docs/GUIA-TESTES-ENDPOINTS.md`

## 🔑 Configuração

### URLs das APIs

```typescript
// services/api.config.ts
Core API: http://192.168.100.10:3000/api
ML API:   https://backend-ml-c75p.onrender.com/api/ml
```

### Autenticação

```typescript
// O token é adicionado automaticamente em todas as requisições
// Salvo em: @wenda_access_token
// Usuário em: @wenda_user
```

## ✨ Recursos Implementados

- ✅ Autenticação automática com token
- ✅ Tipos TypeScript completos
- ✅ Hooks React customizados
- ✅ Tratamento de erros
- ✅ Paginação automática
- ✅ Interceptors configurados
- ✅ Exemplos práticos
- ✅ Testes automatizados
- ✅ Documentação completa

## 🎉 Próximos Passos

1. Adicionar `<ApiTestButton />` em uma tela para testar
2. Verificar se os backends estão rodando
3. Executar os testes
4. Começar a usar os serviços nos componentes

## 📞 Suporte

Veja os exemplos completos em:
- `examples/ApiUsageExamples.tsx`
- `docs/QUICK_START.md`
- `docs/API_INTEGRATION.md`

---

**✅ Integração completa e pronta para uso!**
