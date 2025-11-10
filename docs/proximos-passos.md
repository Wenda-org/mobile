# 🚀 Wenda Mobile - Próximos Passos e Roadmap

**Data:** 10 de Novembro de 2025  
**Versão Atual:** 1.0.0 (35-40% completo)  
**Objetivo:** Guia prático para completar o MVP

---

## 🎯 VISÃO GERAL

Este documento detalha exatamente **o que falta fazer** no Wenda Mobile, com foco em:
- Frontend e fluxo de telas
- Priorização clara
- Estimativas realistas
- Checklist acionável

---

## 📊 PRIORIZAÇÃO

### 🔴 **P0 - CRÍTICO** (Sem isso o app não funciona)
1. Integração com Backend/API
2. Trip Planner (feature core)
3. Autenticação Real

### 🟡 **P1 - ALTA** (MVP precisa disso)
4. Sistema de Busca funcional
5. Recomendações IA
6. Eventos

### 🟢 **P2 - MÉDIA** (Nice to have para MVP)
7. Melhorias na Tela de Detalhes
8. Melhorias de UX/UI
9. Perfil completo

### ⚪ **P3 - BAIXA** (Post-MVP)
10. Modo Offline
11. Features avançadas (QR, AR, Chatbot)

---

## 🔴 PRIORIDADE 0 - CRÍTICO

### 1. INTEGRAÇÃO COM BACKEND/API

**Status:** ❌ Não iniciado  
**Tempo estimado:** 1-2 semanas  
**Impacto:** 🔴 BLOQUEANTE

#### O que fazer:

**1.1. Setup Inicial**
```bash
# Criar arquivo de ambiente
touch .env

# Adicionar variáveis
echo "API_URL=https://api.wenda.ao" >> .env
echo "GOOGLE_CLIENT_ID=your_id_here" >> .env
```

**1.2. Criar estrutura de serviços**
```
mobile/
├── services/
│   ├── api.ts              # Axios instance configurada
│   ├── destinations.ts     # Serviços de destinos
│   ├── auth.ts            # Serviços de autenticação
│   ├── trips.ts           # Serviços de viagens
│   ├── events.ts          # Serviços de eventos
│   └── recommendations.ts  # Serviços de recomendações
```

**1.3. Implementar serviços API**

Criar `services/api.ts`:
```typescript
import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl || 'https://api.wenda.ao',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors para token, loading, errors
export default api;
```

Criar `services/destinations.ts`:
```typescript
import api from './api';

export const destinationService = {
  getAll: (params?: { category?: string; limit?: number }) => 
    api.get('/destinations', { params }),
  
  getById: (id: string) => 
    api.get(`/destinations/${id}`),
  
  search: (query: string) => 
    api.get('/destinations/search', { params: { q: query } }),
  
  getNearby: (lat: number, lon: number, radius: number) =>
    api.get('/destinations/nearby', { params: { lat, lon, radius } }),
};
```

**1.4. Integrar React Query**

Criar `hooks/useDestinations.ts`:
```typescript
import { useQuery } from '@tanstack/react-query';
import { destinationService } from '../services/destinations';

export function useDestinations(category?: string) {
  return useQuery({
    queryKey: ['destinations', category],
    queryFn: () => destinationService.getAll({ category }),
  });
}

export function useDestination(id: string) {
  return useQuery({
    queryKey: ['destination', id],
    queryFn: () => destinationService.getById(id),
    enabled: !!id,
  });
}
```

**1.5. Atualizar telas para usar dados reais**

Em `app/(tabs)/index.tsx`:
```typescript
// ANTES (mockado):
const mockDestinations = [...];

// DEPOIS (real):
const { data: destinations, isLoading, error } = useDestinations(activeFilter);
```

**1.6. Adicionar Loading States e Error Handling**
- Skeleton loaders durante carregamento
- Error boundaries para erros
- Retry mechanisms
- Toast notifications

#### Checklist:
- [ ] Criar `.env` com API_URL
- [ ] Criar pasta `services/`
- [ ] Implementar `api.ts` base
- [ ] Implementar `destinations.ts`
- [ ] Implementar `auth.ts`
- [ ] Implementar `trips.ts`
- [ ] Criar hooks React Query
- [ ] Atualizar Home para usar API
- [ ] Atualizar Detalhes para usar API
- [ ] Atualizar Mapa para usar API
- [ ] Adicionar loading states
- [ ] Adicionar error handling
- [ ] Testar com backend real

---

### 2. TRIP PLANNER (PLANEJADOR DE VIAGENS)

**Status:** ❌ Não iniciado  
**Tempo estimado:** 1-2 semanas  
**Impacto:** 🔴 BLOQUEANTE (feature core)

#### O que fazer:

**2.1. Criar estrutura de telas**
```
app/
├── (tabs)/
│   └── trips.tsx          # Nova tab - lista de viagens
├── trip/
│   ├── [id].tsx          # Detalhes da viagem
│   ├── new.tsx           # Criar nova viagem
│   └── edit.tsx          # Editar viagem
```

**2.2. Criar Zustand Store para Trips**

Criar `stores/useTripsStore.ts`:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  destinations: Destination[];
  notes?: string;
}

interface TripsStore {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addDestinationToTrip: (tripId: string, destination: Destination) => void;
  removeDestinationFromTrip: (tripId: string, destinationId: string) => void;
}

export const useTripsStore = create<TripsStore>()(
  persist(
    (set) => ({
      trips: [],
      addTrip: (trip) => set((state) => ({ 
        trips: [...state.trips, trip] 
      })),
      // ... outros métodos
    }),
    { name: 'trips-storage', storage: AsyncStorage }
  )
);
```

**2.3. Tela de Lista de Viagens (`/(tabs)/trips.tsx`)**

Elementos necessários:
- Header com título "My Trips"
- Botão "Create New Trip"
- Lista de viagens com cards mostrando:
  - Nome da viagem
  - Datas
  - Número de destinos
  - Preview de imagens
- Empty state quando sem viagens
- Opções de filtro (upcoming, past, all)

**2.4. Tela de Nova Viagem (`/trip/new.tsx`)**

Formulário com:
- Input: Nome da viagem
- Date pickers: Data início e fim
- Text area: Notas/descrição
- Botão "Create Trip"
- Validações

**2.5. Tela de Detalhes da Viagem (`/trip/[id].tsx`)**

Seções:
- Header com nome e datas
- Botões: Edit, Share, Delete
- Lista de destinos (ordem = itinerário)
  - Drag & drop para reordenar
  - Opção de remover
- Botão "Add Destination"
- Mapa com rota otimizada
- Estatísticas (distância total, duração estimada)

**2.6. Funcionalidade "Add to Trip"**

Quando clicar em "Add to Trip" na tela de detalhes:
- Abrir modal/bottom sheet
- Mostrar lista de viagens existentes
- Opção "Create New Trip"
- Confirmar adição
- Toast de sucesso

**2.7. Otimização de Rotas**

Implementar algoritmo básico:
```typescript
// utils/routeOptimizer.ts
export function optimizeRoute(destinations: Destination[]) {
  // Algoritmo do vizinho mais próximo
  // Ou integrar com Google Routes API
}
```

#### Checklist:
- [ ] Criar `useTripsStore.ts`
- [ ] Criar tela `/(tabs)/trips.tsx`
- [ ] Criar tela `/trip/new.tsx`
- [ ] Criar tela `/trip/[id].tsx`
- [ ] Implementar formulário de criar viagem
- [ ] Implementar adicionar destino à viagem
- [ ] Implementar reordenação de destinos
- [ ] Implementar edição de viagem
- [ ] Implementar exclusão de viagem
- [ ] Implementar compartilhamento
- [ ] Adicionar tab "Trips" na navegação
- [ ] Integrar com backend (se disponível)
- [ ] Implementar otimização de rota básica
- [ ] Adicionar testes

---

### 3. AUTENTICAÇÃO REAL

**Status:** ⚠️ UI pronta, lógica não  
**Tempo estimado:** 1 semana  
**Impacto:** 🔴 CRÍTICO (segurança)

#### O que fazer:

**3.1. Escolher Provider**
- Opção 1: Firebase Auth (recomendado)
- Opção 2: Auth0
- Opção 3: Backend próprio com JWT

**3.2. Setup Firebase Auth**

```bash
npm install firebase @react-native-firebase/app @react-native-firebase/auth
```

Criar `services/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

**3.3. Atualizar `useAuth` hook**

```typescript
// hooks/useAuth.ts
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Atualizar perfil com nome
    return result;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    return signOut(auth);
  };

  return { user, login, register, loginWithGoogle, logout, loading };
}
```

**3.4. Proteção de Rotas**

Criar `app/_layout.tsx` com verificação de auth:
```typescript
export default function RootLayout() {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <Stack>
      {!user ? (
        // Rotas de autenticação
        <Stack.Screen name="(auth)" />
      ) : (
        // Rotas principais
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}
```

**3.5. Recuperação de Senha**

Criar `app/(auth)/forgot-password.tsx`:
```typescript
import { sendPasswordResetEmail } from 'firebase/auth';
// Implementar formulário e lógica
```

**3.6. Verificação de Email**

```typescript
import { sendEmailVerification } from 'firebase/auth';
// Enviar após registro
```

#### Checklist:
- [ ] Instalar Firebase
- [ ] Configurar Firebase project
- [ ] Criar `firebase.ts` config
- [ ] Atualizar `useAuth` com Firebase
- [ ] Implementar login com email/senha
- [ ] Implementar registro
- [ ] Implementar Google OAuth
- [ ] Implementar logout
- [ ] Implementar forgot password
- [ ] Implementar email verification
- [ ] Adicionar proteção de rotas
- [ ] Persistir sessão
- [ ] Adicionar error handling
- [ ] Testar fluxo completo

---

## 🟡 PRIORIDADE 1 - ALTA

### 4. SISTEMA DE BUSCA FUNCIONAL

**Status:** ⚠️ UI existe, não funciona  
**Tempo estimado:** 3-5 dias

#### O que fazer:

**4.1. Criar Tela de Resultados**

Criar `app/search.tsx`:
```typescript
// Tela de resultados de busca
// Lista filtrada de destinos
// Filtros aplicáveis
// Ordenação
```

**4.2. Implementar Busca no Backend**
```typescript
// services/destinations.ts
search: async (query: string, filters?: SearchFilters) => {
  return api.get('/destinations/search', { 
    params: { q: query, ...filters } 
  });
}
```

**4.3. Implementar SearchBar funcional**

Atualizar `components/SearchBar.tsx`:
- Debounce no input (300ms)
- Sugestões em dropdown
- Navegação para resultados

**4.4. Filtros Avançados**
- Categoria
- Distância
- Rating mínimo
- Faixa de preço
- Ordenação (relevância, distância, rating, popularidade)

#### Checklist:
- [ ] Criar tela de resultados
- [ ] Implementar API de busca
- [ ] Adicionar debounce no input
- [ ] Adicionar sugestões (autocomplete)
- [ ] Implementar filtros
- [ ] Implementar ordenação
- [ ] Adicionar histórico de buscas
- [ ] Testar performance

---

### 5. RECOMENDAÇÕES COM IA

**Status:** ❌ Não existe  
**Tempo estimado:** 1 semana

#### O que fazer:

**5.1. Criar Tela de Recomendações**

Criar `app/(tabs)/recommendations.tsx` ou seção na Home:
- Header "Recommended for You"
- Cards de destinos recomendados
- Explicação do porquê (ex: "Based on your interest in nature")
- Botão "Refresh Suggestions"
- Possibilidade de "dislike" para melhorar

**5.2. Implementar API de Recomendações**
```typescript
// services/recommendations.ts
getRecommendations: async (userId: string, preferences: UserPreferences) => {
  return api.get('/recommendations', { params: { userId, ...preferences } });
}
```

**5.3. Configurar Preferências do Usuário**

No perfil, adicionar seção:
- Interesses (checkboxes): Nature, Culture, History, Adventure, Food, etc.
- Tipo de viagem: Solo, Family, Romantic, Group
- Orçamento: Low, Medium, High
- Salvar preferências no backend

**5.4. Algoritmo Básico (se backend não tiver ML)**
```typescript
// utils/recommendations.ts
export function generateRecommendations(
  user: User,
  destinations: Destination[],
  favorites: Favorite[]
) {
  // Filtrar por preferências
  // Calcular score baseado em:
  // - Categoria matches interests
  // - Similaridade com favoritos
  // - Popularidade
  // - Proximidade
  // - Não visitados
  return sortedRecommendations;
}
```

#### Checklist:
- [ ] Criar tela de recomendações
- [ ] Implementar API integration
- [ ] Criar seção de preferências no perfil
- [ ] Salvar preferências do usuário
- [ ] Implementar algoritmo básico (fallback)
- [ ] Adicionar explicações das recomendações
- [ ] Implementar "refresh"
- [ ] Adicionar feedback (like/dislike)

---

### 6. EVENTOS

**Status:** ❌ Não existe  
**Tempo estimado:** 3-5 dias

#### O que fazer:

**6.1. Adicionar Seção de Eventos na Home**

Em `app/(tabs)/index.tsx`:
```tsx
{/* Events Nearby Section */}
<View className="px-4 mb-6">
  <Text className="text-xl font-bold mb-3">
    {t('events_nearby')}
  </Text>
  <EventsCarousel events={upcomingEvents} />
</View>
```

**6.2. Criar EventCard Component**
```typescript
// components/EventCard.tsx
interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  category: string;
}
```

**6.3. Criar Tela de Detalhes de Evento**

Criar `app/event/[id].tsx`:
- Imagem do evento
- Nome, data, horário
- Localização (com mapa)
- Descrição
- Preço/ingresso
- Botões: "Add to Calendar", "Get Directions", "Share"

**6.4. API de Eventos**
```typescript
// services/events.ts
getUpcoming: (location: Location, radius: number) => 
  api.get('/events/upcoming', { params: { ...location, radius } }),

getById: (id: string) => 
  api.get(`/events/${id}`),

search: (query: string, filters: EventFilters) =>
  api.get('/events/search', { params: { q: query, ...filters } }),
```

**6.5. Filtros de Eventos**
- Por data (hoje, esta semana, este mês)
- Por categoria (música, cultura, esportes, etc)
- Por localização

#### Checklist:
- [ ] Criar EventCard component
- [ ] Adicionar seção na Home
- [ ] Criar tela de detalhes
- [ ] Implementar API integration
- [ ] Adicionar "Add to Calendar"
- [ ] Implementar filtros
- [ ] Adicionar busca de eventos

---

## 🟢 PRIORIDADE 2 - MÉDIA

### 7. MELHORIAS NA TELA DE DETALHES

**Status:** ✅ Funcional, mas pode melhorar  
**Tempo estimado:** 2-3 dias

#### O que fazer:

**7.1. Implementar Nearby Places Tab**

Atualizar `app/destination/[id].tsx`:
```tsx
{activeTab === 'nearby' && (
  <View>
    {nearbyDestinations.map(dest => (
      <DestinationCard key={dest.id} destination={dest} />
    ))}
  </View>
)}
```

Fetch nearby:
```typescript
const { data: nearby } = useQuery({
  queryKey: ['nearby', destination.id],
  queryFn: () => destinationService.getNearby(
    destination.coordinate.latitude,
    destination.coordinate.longitude,
    10 // 10km radius
  ),
});
```

**7.2. Botão "Open on Map" Funcional**

```typescript
const handleOpenOnMap = () => {
  router.push({
    pathname: '/(tabs)/map',
    params: {
      focusLat: destination.coordinate.latitude,
      focusLon: destination.coordinate.longitude,
      focusId: destination.id,
    }
  });
};
```

Atualizar `/(tabs)/map.tsx` para receber params e focar no destino.

**7.3. Botão "Add to Trip" Funcional**

```typescript
const handleAddToTrip = () => {
  setShowTripSelector(true);
};

// Modal com lista de viagens
<Modal visible={showTripSelector}>
  <TripSelectorModal 
    destination={destination}
    onSelect={handleTripSelected}
    onClose={() => setShowTripSelector(false)}
  />
</Modal>
```

**7.4. Galeria com Zoom**

Usar biblioteca como `react-native-image-viewing`:
```bash
npm install react-native-image-viewing
```

**7.5. Informações Adicionais**

Adicionar seção no Overview:
- Contato: telefone, email, website
- Acessibilidade: cadeira de rodas, etc
- Facilidades: WiFi, estacionamento, restaurante
- Dicas: melhor época, quanto tempo gastar

**7.6. Sistema de Compartilhamento**

```typescript
import * as Sharing from 'expo-sharing';

const handleShare = async () => {
  await Sharing.shareAsync({
    message: `Check out ${destination.name} on Wenda!`,
    url: `https://wenda.ao/destination/${destination.id}`,
  });
};
```

#### Checklist:
- [ ] Implementar Nearby Places tab
- [ ] Tornar "Open on Map" funcional
- [ ] Tornar "Add to Trip" funcional
- [ ] Adicionar galeria com zoom
- [ ] Adicionar mais informações
- [ ] Implementar compartilhamento
- [ ] Adicionar review funcional (escrever)
- [ ] Filtros/ordenação de reviews

---

### 8. MELHORIAS DE UX/UI

**Status:** ⚠️ Bom, mas falta polish  
**Tempo estimado:** 1 semana

#### O que fazer:

**8.1. Loading States (Skeleton Loaders)**

Criar componentes:
```typescript
// components/skeletons/DestinationCardSkeleton.tsx
// components/skeletons/DetailsSkeleton.tsx
```

Usar enquanto carrega:
```tsx
{isLoading ? (
  <DestinationCardSkeleton count={3} />
) : (
  destinations.map(dest => <DestinationCard ... />)
)}
```

**8.2. Toast Notifications**

Instalar:
```bash
npm install react-native-toast-message
```

Usar para feedback:
```typescript
Toast.show({
  type: 'success',
  text1: 'Added to favorites!',
});
```

**8.3. Error Boundaries**

Criar `components/ErrorBoundary.tsx`:
```typescript
export class ErrorBoundary extends React.Component {
  // Catch errors e mostrar UI amigável
}
```

**8.4. Pull to Refresh**

Adicionar em listas:
```tsx
<ScrollView
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
```

**8.5. Animações**

Usar `react-native-reanimated` já instalado:
- Transições suaves entre telas
- Fade in ao carregar imagens
- Slide in ao abrir modais

**8.6. Empty States Melhores**

Melhorar design de:
- Sem favoritos
- Sem viagens
- Sem resultados de busca
- Sem eventos

#### Checklist:
- [ ] Criar skeleton loaders
- [ ] Implementar toast notifications
- [ ] Adicionar error boundaries
- [ ] Implementar pull to refresh
- [ ] Adicionar animações
- [ ] Melhorar empty states
- [ ] Adicionar haptic feedback
- [ ] Loading indicators consistentes

---

### 9. PERFIL COMPLETO

**Status:** ⚠️ Básico, precisa melhorar  
**Tempo estimado:** 3 dias

#### O que fazer:

**9.1. Editar Perfil Funcional**

Criar `app/profile/edit.tsx`:
- Upload de foto
- Editar nome
- Editar email
- Editar país
- Salvar no backend

**9.2. Preferências Completas**

Criar `app/profile/preferences.tsx`:
- Interesses (multi-select)
- Tipo de viagem
- Orçamento preferido
- Idioma
- Unidades (km/mi)

**9.3. Estatísticas**

Adicionar na tela de perfil:
- Destinos visitados
- Distância total percorrida
- Países visitados
- Reviews escritas

**9.4. Histórico**

Criar seção:
- Destinos recentemente visualizados
- Buscas recentes
- Check-ins (se implementar)

**9.5. Configurações Funcionais**

- Trocar idioma (já existe UI)
- Notificações on/off
- Tema (light/dark/auto)
- Limpar cache
- Sobre/versão do app

#### Checklist:
- [ ] Implementar edição de perfil
- [ ] Upload de foto
- [ ] Preferências completas
- [ ] Estatísticas
- [ ] Histórico
- [ ] Trocar idioma funcional
- [ ] Configurações de notificações
- [ ] Tema switcher

---

## ⚪ PRIORIDADE 3 - BAIXA (POST-MVP)

### 10. MODO OFFLINE

- Cache de destinos visitados
- Mapas offline
- Sincronização quando online

### 11. FEATURES AVANÇADAS

- QR Code scanner
- Chatbot com IA
- Realidade Aumentada
- Integração com redes sociais
- Sistema de badges/conquistas
- Gamificação

---

## 📅 CRONOGRAMA SUGERIDO

### **Semana 1-2: Backend Integration**
- Dias 1-3: Setup API e serviços
- Dias 4-7: Integrar React Query
- Dias 8-10: Atualizar telas com dados reais
- Dias 11-14: Loading states e error handling

### **Semana 3-4: Trip Planner**
- Dias 1-3: Store e estrutura
- Dias 4-7: Tela de lista e criar viagem
- Dias 8-10: Tela de detalhes
- Dias 11-14: "Add to Trip" e otimização

### **Semana 5: Autenticação**
- Dias 1-2: Setup Firebase
- Dias 3-4: Implementar login/register
- Dias 5-6: Google OAuth e proteção de rotas
- Dia 7: Testes

### **Semana 6: Busca e Recomendações**
- Dias 1-3: Sistema de busca
- Dias 4-7: Recomendações IA

### **Semana 7: Eventos e Melhorias**
- Dias 1-3: Eventos
- Dias 4-7: Melhorias na tela de detalhes

### **Semana 8: Polish e UX**
- Dias 1-4: Skeletons, toasts, animações
- Dias 5-7: Testes e correções

**Total: 8 semanas para MVP completo** 🎯

---

## ✅ CHECKLIST MASTER DO MVP

### Backend & Data
- [ ] API configurada e funcionando
- [ ] Dados reais integrados
- [ ] Loading e error states
- [ ] Cache com React Query

### Features Core
- [ ] Trip Planner completo
- [ ] Autenticação real
- [ ] Favoritos funcionando
- [ ] Detalhes completos

### Features Importantes
- [ ] Busca funcional
- [ ] Recomendações IA
- [ ] Eventos
- [ ] Mapa com navegação

### UX/UI
- [ ] Skeleton loaders
- [ ] Toast notifications
- [ ] Animações suaves
- [ ] Empty states bonitos

### Polish
- [ ] Testes manuais completos
- [ ] Performance otimizada
- [ ] Sem crashes
- [ ] Pronto para produção

---

## 🎯 DEFINIÇÃO DE "PRONTO"

Uma feature está **pronta** quando:
- ✅ Código implementado e funcional
- ✅ Integrado com backend (se necessário)
- ✅ Loading e error states
- ✅ Testado em iOS e Android
- ✅ UI/UX polido
- ✅ Sem bugs críticos

---

## 📞 RECURSOS E AJUDA

### Documentação Útil:
- [Expo Docs](https://docs.expo.dev)
- [React Query](https://tanstack.com/query)
- [NativeWind](https://www.nativewind.dev)
- [Firebase Auth](https://firebase.google.com/docs/auth)

### Bibliotecas Recomendadas:
- `react-native-toast-message` - Notificações
- `react-native-image-viewing` - Galeria de imagens
- `react-native-skeleton-placeholder` - Skeletons
- `@react-native-community/datetimepicker` - Date pickers

---

**Este documento é um guia vivo. Atualize conforme o progresso!** 🚀
