# ✅ Checklist de Implementação - Integração API

Use este checklist para garantir que a integração foi feita corretamente.

## 📋 Configuração Inicial

- [x] ✅ Axios instalado (`npm install axios`)
- [x] ✅ AsyncStorage configurado
- [x] ✅ Services criados (auth, destination, favorite, review, trip, ml)
- [x] ✅ Tipos TypeScript definidos
- [x] ✅ Hooks customizados criados
- [x] ✅ Componente de teste criado

## 🔧 Antes de Começar

- [ ] 🔌 Backend Core rodando em `http://192.168.100.10:3000`
- [ ] 🤖 Backend ML acessível em `https://backend-ml-c75p.onrender.com`
- [ ] 🧪 Testar endpoints com curl/Postman

### Testes de Conectividade

```bash
# Core API
curl http://192.168.100.10:3000/api/destinations

# ML API
curl https://backend-ml-c75p.onrender.com/api/ml/health
```

## 🚀 Implementação por Funcionalidade

### 1. Autenticação (Login/Registro)

**Arquivos a modificar:**
- [ ] `app/(auth)/login.tsx`
- [ ] `app/(auth)/register.tsx`
- [ ] `hooks/useAuth.ts` (criar se necessário)

**Exemplo de código:**
```typescript
import { authService } from '@/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleLogin = async (email: string, password: string) => {
  const response = await authService.login({ email, password });
  if (response.success && response.data) {
    await AsyncStorage.setItem('@wenda_access_token', response.data.accessToken);
    await AsyncStorage.setItem('@wenda_user', JSON.stringify(response.data.user));
    router.replace('/(tabs)');
  }
};
```

**Testes:**
- [ ] Login com credenciais válidas funciona
- [ ] Erro exibido com credenciais inválidas
- [ ] Token salvo no AsyncStorage
- [ ] Navegação para tela principal após login

---

### 2. Listagem de Destinos

**Arquivos a modificar:**
- [ ] `app/(tabs)/index.tsx`
- [ ] `components/DestinationCard.tsx` (se necessário)

**Exemplo de código:**
```typescript
import { destinationService } from '@/services';
import { useDestinations } from '@/hooks/useDestinations';

// Opção 1: Hook (recomendado)
const { destinations, loading, fetchDestinations } = useDestinations();

useEffect(() => {
  fetchDestinations({ province: 'Luanda' });
}, []);

// Opção 2: Direto
const [destinations, setDestinations] = useState([]);

useEffect(() => {
  const load = async () => {
    const response = await destinationService.getDestinations();
    setDestinations(response.data);
  };
  load();
}, []);
```

**Testes:**
- [ ] Destinos carregam na primeira renderização
- [ ] Loading state funciona
- [ ] Filtros por província funcionam
- [ ] Paginação funciona (carregar mais)
- [ ] Pull-to-refresh funciona

---

### 3. Detalhes do Destino

**Arquivos a modificar:**
- [ ] `app/destination/[id].tsx`

**Exemplo de código:**
```typescript
import { destinationService } from '@/services';

const { id } = useLocalSearchParams();
const [destination, setDestination] = useState(null);

useEffect(() => {
  const load = async () => {
    const response = await destinationService.getDestinationById(id as string);
    setDestination(response.data);
  };
  load();
}, [id]);
```

**Testes:**
- [ ] Detalhes carregam ao abrir destino
- [ ] Imagens exibidas corretamente
- [ ] Avaliação e informações exibidas
- [ ] Reviews carregam

---

### 4. Sistema de Favoritos

**Arquivos a modificar:**
- [ ] `app/(tabs)/favorites.tsx`
- [ ] `stores/useFavoritesStore.ts` (migrar para API)
- [ ] `components/DestinationCard.tsx` (botão de favorito)

**Exemplo de código:**
```typescript
import { favoriteService } from '@/services';
import { useFavorites } from '@/hooks/useFavorites';

const { favorites, addFavorite, removeFavorite, checkFavorite } = useFavorites();

// Adicionar
const handleAddFavorite = async (destinationId: string) => {
  const success = await addFavorite(destinationId);
  if (success) {
    Alert.alert('Sucesso', 'Adicionado aos favoritos!');
  }
};

// Remover
const handleRemoveFavorite = async (favoriteId: string) => {
  const success = await removeFavorite(favoriteId);
  if (success) {
    Alert.alert('Sucesso', 'Removido dos favoritos!');
  }
};
```

**Testes:**
- [ ] Listar favoritos do usuário
- [ ] Adicionar favorito funciona
- [ ] Remover favorito funciona
- [ ] Ícone de coração atualiza corretamente
- [ ] Sincronização entre telas

---

### 5. Avaliações (Reviews)

**Arquivos a modificar:**
- [ ] `app/destination/[id].tsx` (mostrar reviews)
- [ ] Criar modal/tela para adicionar review

**Exemplo de código:**
```typescript
import { reviewService } from '@/services';

// Listar reviews
const [reviews, setReviews] = useState([]);

useEffect(() => {
  const load = async () => {
    const response = await reviewService.getReviewsByDestination(destinationId);
    setReviews(response.data);
  };
  load();
}, [destinationId]);

// Criar review
const handleSubmitReview = async (rating: number, comment: string) => {
  const response = await reviewService.createReview({
    destinationId,
    rating,
    comment,
    visitDate: new Date().toISOString(),
  });
  
  if (response.success) {
    Alert.alert('Sucesso', 'Review adicionada!');
    // Recarregar reviews
  }
};
```

**Testes:**
- [ ] Reviews exibidas em detalhes do destino
- [ ] Criar review funciona
- [ ] Editar própria review funciona
- [ ] Deletar própria review funciona
- [ ] Marcar review como útil funciona

---

### 6. Viagens (Trips)

**Arquivos a modificar:**
- [ ] `app/(tabs)/trips.tsx`
- [ ] `app/trip/[id].tsx`
- [ ] `app/trip/new.tsx`

**Exemplo de código:**
```typescript
import { tripService } from '@/services';

// Listar viagens
const [trips, setTrips] = useState([]);

useEffect(() => {
  const load = async () => {
    const response = await tripService.getTrips();
    setTrips(response.data);
  };
  load();
}, []);

// Criar viagem
const handleCreateTrip = async () => {
  const response = await tripService.createTrip({
    title: 'Minha Viagem',
    description: 'Descrição',
    startDate: '2025-12-01',
    endDate: '2025-12-10',
  });
  
  if (response.success) {
    router.push(`/trip/${response.data.id}`);
  }
};

// Adicionar destino à viagem
const handleAddDestination = async (tripId: string, destinationId: string) => {
  await tripService.addDestination(tripId, {
    destinationId,
    visitDate: '2025-12-02',
  });
};
```

**Testes:**
- [ ] Listar viagens do usuário
- [ ] Criar nova viagem
- [ ] Editar viagem
- [ ] Deletar viagem
- [ ] Adicionar destino à viagem
- [ ] Remover destino da viagem

---

### 7. Categorias

**Arquivos a modificar:**
- [ ] `app/(tabs)/index.tsx` (filtros)

**Exemplo de código:**
```typescript
import { categoryService } from '@/services';

const [categories, setCategories] = useState([]);

useEffect(() => {
  const load = async () => {
    const response = await categoryService.getCategories();
    setCategories(response.data);
  };
  load();
}, []);
```

**Testes:**
- [ ] Categorias carregam
- [ ] Filtro por categoria funciona
- [ ] Contagem de destinos por categoria exibida

---

### 8. Machine Learning - Previsões

**Arquivos a modificar:**
- [ ] Criar tela de estatísticas/insights
- [ ] `app/insights.tsx` (ou similar)

**Exemplo de código:**
```typescript
import { mlService } from '@/services';
import { useForecast } from '@/hooks/useML';

const { forecast, loading, getForecast } = useForecast();

const handleGetForecast = async () => {
  await getForecast({
    province: 'Luanda',
    month: 12,
    year: 2025,
  });
};

// Exibir resultado
{forecast && (
  <Text>Visitantes previstos: {forecast.predicted_visitors}</Text>
)}
```

**Testes:**
- [ ] Previsão funciona para diferentes províncias
- [ ] Intervalo de confiança exibido
- [ ] Gráfico/visualização (opcional)

---

### 9. Machine Learning - Recomendações

**Arquivos a modificar:**
- [ ] `app/(tabs)/index.tsx` (seção de recomendações)
- [ ] Criar seção "Recomendado para você"

**Exemplo de código:**
```typescript
import { mlService } from '@/services';

const [recommendations, setRecommendations] = useState([]);

useEffect(() => {
  const load = async () => {
    const response = await mlService.getRecommendations({
      user_preferences: {
        preferred_categories: ['natural', 'historical'],
        preferred_provinces: ['Luanda'],
      },
      top_n: 10,
    });
    setRecommendations(response.recommendations);
  };
  load();
}, []);
```

**Testes:**
- [ ] Recomendações personalizadas funcionam
- [ ] Score de similaridade faz sentido
- [ ] Baseado em preferências do usuário

---

## 🧪 Testes Gerais

### Funcionalidade
- [ ] Todas as telas carregam dados da API
- [ ] Não há mais dados mockados (mock data removido)
- [ ] Loading states funcionam
- [ ] Error states funcionam
- [ ] Pull-to-refresh funciona
- [ ] Paginação funciona

### Performance
- [ ] Requisições não duplicadas
- [ ] Cache implementado onde necessário
- [ ] Imagens carregam com otimização

### Autenticação
- [ ] Token salvo e recuperado corretamente
- [ ] Logout limpa token
- [ ] Redirecionamento ao expirar token (401)
- [ ] Interceptor adiciona token automaticamente

### Tratamento de Erros
- [ ] Erros de rede tratados
- [ ] Erros 401 tratados (token expirado)
- [ ] Erros 404 tratados
- [ ] Erros 500 tratados
- [ ] Mensagens de erro amigáveis

---

## 🎯 Próximos Passos Opcionais

- [ ] Implementar offline-first com cache
- [ ] Adicionar analytics
- [ ] Implementar notificações push
- [ ] Adicionar compartilhamento social
- [ ] Implementar deep linking
- [ ] Adicionar testes unitários
- [ ] Adicionar testes E2E

---

## 📚 Recursos

- **Documentação:** `docs/API_INTEGRATION.md`
- **Início Rápido:** `docs/QUICK_START.md`
- **Exemplos:** `examples/ApiUsageExamples.tsx`
- **Testes:** `tests/apiIntegrationTest.ts`
- **Botão de Teste:** `components/ApiTestButton.tsx`

---

**✅ Ao completar este checklist, sua integração estará 100% funcional!**
