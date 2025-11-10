# 🔄 Wenda Mobile - Fluxo de Telas e Navegação

**Foco:** Análise detalhada do fluxo entre telas e melhorias necessárias

---

## 📱 MAPA ATUAL DE NAVEGAÇÃO

```
┌─────────────────────────────────────────────────────┐
│                  APP FLOW ATUAL                      │
└─────────────────────────────────────────────────────┘

ONBOARDING FLOW (Primeira vez)
═══════════════════════════════
┌──────────────┐
│   Language   │ ✅ Funcional
│   Selection  │
└──────┬───────┘
       │
       ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Onboarding 1 │───▶│ Onboarding 2 │───▶│ Onboarding 3 │ ✅
│  Discover    │    │    Smart     │    │     Plan     │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                                │
                                                ▼
                                        ┌──────────────┐
                                        │ Get Started  │
                                        │   Button     │
                                        └──────┬───────┘
                                               │
       ┌───────────────────────────────────────┘
       │
       ▼
AUTH FLOW
═════════
┌──────────────┐           ┌──────────────┐
│    Login     │◀─────────▶│   Register   │ ✅ UI Pronta
└──────┬───────┘           └──────┬───────┘    ❌ Não integrada
       │                          │
       └──────────┬───────────────┘
                  │
                  ▼
              ⚠️ FAKE AUTH (não valida)
                  │
                  ▼

MAIN APP FLOW
═════════════
┌─────────────────────────────────────────────────────┐
│                    TABS NAVIGATION                   │
│                                                       │
│  ┌───────────┬──────────┬───────────┬─────────────┐ │
│  │  Discover │   Map    │ Favorites │   Profile   │ │
│  │     🏠    │    🗺️    │    ❤️     │     👤      │ │
│  │     ✅    │    ✅    │     ✅    │     ✅      │ │
│  └─────┬─────┴──────────┴───────────┴─────────────┘ │
└────────┼─────────────────────────────────────────────┘
         │
         │
    ┌────┴────────────────────────────┐
    │                                 │
    ▼                                 ▼
DISCOVER TAB                      MAP TAB
════════════                      ═══════
┌──────────────┐                 ┌──────────────┐
│ Search Bar   │ ⚠️ UI only      │   MapView    │ ✅
│ Filters      │ ✅              │   Markers    │ ✅
│ Featured     │ ✅              │   Filters    │ ✅
│ Top Dest.    │ ✅              │   Radius     │ ✅
│ Recommended  │ ✅              └──────┬───────┘
└──────┬───────┘                        │
       │                                │
       │ (Tap on card)                  │ (Tap marker)
       │                                │
       └────────────┬───────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │  DESTINATION  │
            │    DETAILS    │ ✅ COMPLETA!
            └───────┬───────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌───────┐  ┌────────┐  ┌────────┐
    │ Fav ❤️│  │  Map   │  │  Trip  │
    │   ✅  │  │   ⚠️   │  │   ❌   │
    └───────┘  └────────┘  └────────┘
                  │
                  │ (Needs implementation)
                  ▼
            ❌ Should navigate to Map Tab
               focused on destination


FAVORITES TAB                  PROFILE TAB
═════════════                  ═══════════
┌──────────────┐              ┌──────────────┐
│ Fav. List    │ ✅           │  User Info   │ ✅
│ Empty State  │ ✅           │  Menu Items  │ ✅
│ Cards        │ ✅           │  Settings    │ ⚠️ UI only
└──────┬───────┘              │  Logout      │ ✅
       │                      └──────────────┘
       │ (Tap card)
       │
       ▼
  (Goes to Details)
```

---

## 🔴 PROBLEMAS DE NAVEGAÇÃO ATUAIS

### 1. **Botão "Open on Map" não funciona**
**Problema:** Clica mas nada acontece  
**Onde:** `app/destination/[id].tsx`  
**Solução:**
```typescript
const handleOpenOnMap = () => {
  router.push({
    pathname: '/(tabs)/map',
    params: {
      lat: destination.coordinate.latitude,
      lon: destination.coordinate.longitude,
      destinationId: destination.id,
    }
  });
};
```

E em `app/(tabs)/map.tsx`:
```typescript
const { lat, lon, destinationId } = useLocalSearchParams();

useEffect(() => {
  if (lat && lon) {
    mapRef.current?.animateToRegion({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  }
}, [lat, lon]);
```

### 2. **Botão "Add to Trip" não funciona**
**Problema:** Não existe Trip Planner ainda  
**Solução:** Criar Trip Planner completo (ver docs/proximos-passos.md)

### 3. **SearchBar não busca**
**Problema:** Input visual apenas, sem lógica  
**Solução:** Criar tela de resultados e integrar API

### 4. **Filtros não aplicam**
**Problema:** Apenas toggle visual  
**Solução:** Filtrar dados reais ao clicar

### 5. **"View All" não faz nada**
**Problema:** Link sem destino  
**Solução:** Criar tela de listagem filtrada

### 6. **Nearby Places tab vazia**
**Problema:** Apenas placeholder  
**Solução:** Buscar destinos próximos e exibir

---

## ✅ FLUXOS QUE FUNCIONAM BEM

### 1. **Discover → Details → Back**
- ✅ Navega suavemente
- ✅ Animação OK
- ✅ Dados passados corretamente

### 2. **Tap Card → Details**
- ✅ DestinationCard navega corretamente
- ✅ ID passado na URL

### 3. **Favoritar/Desfavoritar**
- ✅ Funciona em Details
- ✅ Funciona em Cards
- ✅ Persiste no storage
- ✅ Sincroniza entre telas

### 4. **Tab Navigation**
- ✅ Transições suaves
- ✅ Estado preservado ao trocar tabs

### 5. **Map Markers → Callout**
- ✅ Tap em marker mostra info
- ✅ Callout bem formatado

---

## 🎯 FLUXOS QUE PRECISAM SER IMPLEMENTADOS

### FLUXO 1: Busca Completa
```
Search Bar (Home)
    │
    │ (Type query)
    ▼
Search Results Screen ❌ (criar)
    │
    ├─ Filters Panel
    ├─ Sort Options
    └─ Results List
         │
         │ (Tap result)
         ▼
    Destination Details ✅
```

**Arquivos a criar:**
- `app/search.tsx` - Tela de resultados
- `components/SearchResultCard.tsx` - Card otimizado
- `components/FiltersModal.tsx` - Modal de filtros

**Código necessário:**
```typescript
// components/SearchBar.tsx
const handleSearch = () => {
  router.push({
    pathname: '/search',
    params: { q: searchQuery }
  });
};

// app/search.tsx
export default function SearchScreen() {
  const { q } = useLocalSearchParams();
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useSearchDestinations(q, filters);
  
  return (
    <View>
      <FiltersBar onApply={setFilters} />
      <SortOptions />
      <ResultsList results={data} />
    </View>
  );
}
```

---

### FLUXO 2: Trip Planner Completo
```
Destination Details
    │
    │ (Tap "Add to Trip")
    ▼
Trip Selector Modal ❌ (criar)
    │
    ├─ Existing Trips List
    │    │
    │    │ (Select trip)
    │    ▼
    │  Add Destination to Trip ✅
    │
    └─ Create New Trip
         │
         ▼
    New Trip Form ❌ (criar)
         │
         ▼
    Trip Created + Destination Added ✅
         │
         ▼
    Navigate to Trip Details ❌ (criar)
```

**Arquivos a criar:**
- `app/(tabs)/trips.tsx` - Lista de viagens
- `app/trip/[id].tsx` - Detalhes da viagem
- `app/trip/new.tsx` - Criar viagem
- `components/TripSelectorModal.tsx` - Modal de seleção
- `components/TripCard.tsx` - Card de viagem
- `components/ItineraryItem.tsx` - Item do itinerário

**Fluxo alternativo:**
```
Profile Tab
    │
    │ (Tap "My Trips")
    ▼
Trips List ❌
    │
    ├─ (Tap trip) → Trip Details ❌
    │                    │
    │                    ├─ Edit Itinerary
    │                    ├─ Add Destination
    │                    ├─ View on Map
    │                    └─ Share Trip
    │
    └─ (Tap "New Trip") → New Trip Form ❌
```

---

### FLUXO 3: Map Navigation
```
Map Tab
    │
    ├─ (Apply filters) → Update markers ✅
    ├─ (Adjust radius) → Update markers ✅
    └─ (Tap marker) → Callout ✅
              │
              │ (Tap callout)
              ▼
         Destination Details ✅

───────────────────────────────

Destination Details
    │
    │ (Tap "Open on Map")
    ▼
Map Tab (focused) ❌ (implementar)
    │
    └─ Marker highlighted
    └─ Callout open
    └─ Map centered
```

**Implementação:**
```typescript
// app/destination/[id].tsx
const handleOpenOnMap = () => {
  router.push({
    pathname: '/(tabs)/map',
    params: {
      focusLat: destination.coordinate.latitude,
      focusLon: destination.coordinate.longitude,
      focusId: destination.id,
      showCallout: 'true'
    }
  });
};

// app/(tabs)/map.tsx
const { focusLat, focusLon, focusId, showCallout } = useLocalSearchParams();

useEffect(() => {
  if (focusLat && focusLon) {
    // Animar para a região
    mapRef.current?.animateToRegion({
      latitude: parseFloat(focusLat),
      longitude: parseFloat(focusLon),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 500);

    // Mostrar callout
    if (showCallout === 'true') {
      const marker = markersRef.current[focusId];
      marker?.showCallout();
    }
  }
}, [focusLat, focusLon, focusId]);
```

---

### FLUXO 4: Recomendações
```
Home Tab
    │
    └─ "Recommended for You" Section ✅ (mockado)
              │
              │ (Tap "View All" or "Refresh")
              ▼
         Recommendations Screen ❌ (criar)
              │
              ├─ Personalized Cards
              ├─ Explanation (why recommended)
              ├─ Refresh Button
              └─ Feedback (like/dislike)
                   │
                   │ (Tap card)
                   ▼
              Destination Details ✅

───────────────────────────────

Profile Tab
    │
    │ (Tap "Preferences")
    ▼
Preferences Screen ❌ (criar)
    │
    ├─ Interests (checkboxes)
    ├─ Travel Type
    ├─ Budget
    └─ Save Button
         │
         ▼
    Update User Preferences
         │
         ▼
    Refresh Recommendations
```

**Arquivos a criar:**
- `app/recommendations.tsx` - Tela de recomendações
- `app/profile/preferences.tsx` - Configurar preferências
- `components/RecommendationCard.tsx` - Card com explicação

---

### FLUXO 5: Eventos
```
Home Tab
    │
    └─ "Events Nearby" Section ❌ (criar)
              │
              │ (Tap event)
              ▼
         Event Details ❌ (criar)
              │
              ├─ Event Info
              ├─ Location (map)
              ├─ Date/Time
              ├─ Tickets
              └─ Actions:
                   ├─ Add to Calendar
                   ├─ Get Directions
                   └─ Share

───────────────────────────────

Profile Tab
    │
    │ (Tap "Events")
    ▼
Events List ❌ (opcional)
    │
    ├─ Filter by Date
    ├─ Filter by Category
    └─ Search Events
```

**Arquivos a criar:**
- `app/event/[id].tsx` - Detalhes do evento
- `components/EventCard.tsx` - Card de evento
- `app/events.tsx` - Lista de eventos (opcional)

---

## 🔄 MELHORIAS NO FLUXO DA TELA DE DETALHES

### Estado Atual (✅ Bom):
```
┌─────────────────────────────────────┐
│      DESTINATION DETAILS             │
├─────────────────────────────────────┤
│                                      │
│  [←]                          [♡/❤️] │ ← Header funcional
│                                      │
│  ┌────────────────────────────────┐ │
│  │    Image Gallery (scroll)      │ │ ← Funciona bem
│  │         ● ○ ○                  │ │
│  └────────────────────────────────┘ │
│                                      │
│  📍 Location                         │
│  ⭐ Rating (342 reviews)             │
│                                      │
│  ┌──────┬─────────┬─────────┐       │
│  │Overview│Reviews│ Nearby  │        │ ← Tabs funcionam
│  └──────┴─────────┴─────────┘       │
│                                      │
│  [Overview Content]                  │ ← Bom conteúdo
│  • Description ✅                    │
│  • Opening Hours ✅                  │
│  • Ticket Price ✅                   │
│  • Embedded Map ✅                   │
│                                      │
│  ┌────────────────────────────────┐ │
│  │    Open on Map    │ ⚠️ Não func│ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │    Add to Trip     │ ❌ Não func│ │
│  └────────────────────────────────┘ │
│                                      │
└─────────────────────────────────────┘
```

### Melhorias Necessárias:

#### 1. **Adicionar Mais Informações**
```tsx
// Seção de contato
<View className="mb-4">
  <Text className="font-bold mb-2">Contact</Text>
  <TouchableOpacity onPress={() => Linking.openURL(`tel:${destination.phone}`)}>
    <Text>📞 {destination.phone}</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => Linking.openURL(destination.website)}>
    <Text>🌐 {destination.website}</Text>
  </TouchableOpacity>
  <Text>📧 {destination.email}</Text>
</View>

// Seção de facilidades
<View className="mb-4">
  <Text className="font-bold mb-2">Facilities</Text>
  <View className="flex-row flex-wrap">
    {destination.facilities.map(f => (
      <View key={f} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
        <Text>{getFacilityIcon(f)} {f}</Text>
      </View>
    ))}
  </View>
</View>

// Seção de como chegar
<View className="mb-4">
  <Text className="font-bold mb-2">How to Get There</Text>
  <Text>{destination.directions}</Text>
  <TouchableOpacity onPress={handleGetDirections}>
    <Text className="text-primary">🧭 Get Directions</Text>
  </TouchableOpacity>
</View>
```

#### 2. **Melhorar Tab Reviews**
```tsx
// Adicionar filtros
<View className="flex-row mb-3">
  <Picker
    value={reviewsSort}
    onValueChange={setReviewsSort}
  >
    <Picker.Item label="Most Recent" value="recent" />
    <Picker.Item label="Highest Rated" value="rating" />
    <Picker.Item label="Most Helpful" value="helpful" />
  </Picker>
</View>

// Adicionar possibilidade de escrever review
{user && (
  <TouchableOpacity onPress={handleWriteReview}>
    <Text className="text-primary">✍️ Write a Review</Text>
  </TouchableOpacity>
)}
```

#### 3. **Implementar Tab Nearby**
```tsx
{activeTab === 'nearby' && (
  <View>
    {loadingNearby ? (
      <DestinationCardSkeleton count={3} />
    ) : nearbyDestinations.length === 0 ? (
      <Text>No nearby destinations found</Text>
    ) : (
      nearbyDestinations.map(dest => (
        <DestinationCard
          key={dest.id}
          destination={dest}
          showDistance={true}
        />
      ))
    )}
  </View>
)}
```

#### 4. **Adicionar Botão de Compartilhar**
```tsx
// No header
<TouchableOpacity
  onPress={handleShare}
  className="w-10 h-10 rounded-full bg-white/90 items-center justify-center ml-2"
>
  <Text className="text-xl">↗️</Text>
</TouchableOpacity>

// Função
const handleShare = async () => {
  try {
    await Share.share({
      message: `Check out ${destination.name} on Wenda!\n\n${destination.description}\n\nView details: https://wenda.ao/destination/${destination.id}`,
      url: `https://wenda.ao/destination/${destination.id}`,
      title: destination.name,
    });
  } catch (error) {
    console.error(error);
  }
};
```

#### 5. **Galeria com Zoom**
```tsx
import ImageViewing from 'react-native-image-viewing';

const [imageViewerVisible, setImageViewerVisible] = useState(false);
const [imageViewerIndex, setImageViewerIndex] = useState(0);

// Tornar imagens clicáveis
<TouchableOpacity onPress={() => {
  setImageViewerIndex(idx);
  setImageViewerVisible(true);
}}>
  <Image source={{ uri: img }} ... />
</TouchableOpacity>

// Modal de visualização
<ImageViewing
  images={destination.images.map(uri => ({ uri }))}
  imageIndex={imageViewerIndex}
  visible={imageViewerVisible}
  onRequestClose={() => setImageViewerVisible(false)}
/>
```

#### 6. **Adicionar Breadcrumb/Navigation**
```tsx
// Abaixo do header
<View className="px-4 py-2 flex-row items-center">
  <TouchableOpacity onPress={() => router.back()}>
    <Text className="text-primary">← Destinations</Text>
  </TouchableOpacity>
  <Text className="mx-2">/</Text>
  <Text className="text-gray-500">{destination.category}</Text>
  <Text className="mx-2">/</Text>
  <Text className="text-gray-500">{destination.location}</Text>
</View>
```

---

## 📊 MATRIZ DE NAVEGAÇÃO

| De \ Para | Home | Map | Favorites | Profile | Details | Search | Trip | Event |
|-----------|------|-----|-----------|---------|---------|--------|------|-------|
| **Home** | - | ✅ Tab | ✅ Tab | ✅ Tab | ✅ Card | ⚠️ Search | ❌ | ❌ |
| **Map** | ✅ Tab | - | ✅ Tab | ✅ Tab | ✅ Marker | - | - | - |
| **Favorites** | ✅ Tab | ✅ Tab | - | ✅ Tab | ✅ Card | - | - | - |
| **Profile** | ✅ Tab | ✅ Tab | ✅ Tab | - | - | - | ❌ | - |
| **Details** | ✅ Back | ⚠️ Botão | ✅ Back | ✅ Tab | - | - | ❌ Botão | - |
| **Search** | ✅ Back | ✅ Tab | ✅ Tab | ✅ Tab | ✅ Result | - | - | - |

**Legenda:**
- ✅ Implementado e funciona
- ⚠️ Existe mas não funciona
- ❌ Não implementado
- `-` Não aplicável

---

## 🎯 AÇÕES PRIORITÁRIAS PARA MELHORAR FLUXO

### 🔥 Prioridade Alta (Fazer já!)

1. **Fazer "Open on Map" funcionar**
   - Tempo: 1-2 horas
   - Impacto: Alto
   - Arquivo: `app/destination/[id].tsx` e `app/(tabs)/map.tsx`

2. **Implementar Nearby Places tab**
   - Tempo: 3-4 horas
   - Impacto: Alto
   - Arquivo: `app/destination/[id].tsx`

3. **Criar Trip Selector Modal**
   - Tempo: 1 dia
   - Impacto: Médio (preparação para Trip Planner)
   - Arquivos: `components/TripSelectorModal.tsx`

4. **Implementar busca funcional**
   - Tempo: 2-3 dias
   - Impacto: Alto
   - Arquivos: `app/search.tsx`, atualizar `components/SearchBar.tsx`

### 🟡 Prioridade Média

5. **Adicionar mais informações nos detalhes**
   - Tempo: 1 dia
   - Impacto: Médio
   - Arquivo: `app/destination/[id].tsx`

6. **Implementar compartilhamento**
   - Tempo: 2-3 horas
   - Impacto: Baixo-Médio
   - Arquivo: `app/destination/[id].tsx`

7. **Melhorar reviews (filtros, escrever)**
   - Tempo: 1-2 dias
   - Impacto: Médio
   - Arquivo: `app/destination/[id].tsx`

---

## ✅ CHECKLIST DE FLUXO COMPLETO

### Navegação Básica
- [x] Tab navigation funciona
- [x] Voltar funciona
- [x] Deeplinks (destinos por ID)
- [ ] Breadcrumbs/navigation trail
- [ ] Histórico de navegação

### Discover → Details
- [x] Tap em card navega para detalhes
- [x] Detalhes carregam corretamente
- [x] Voltar retorna para Home
- [ ] Busca funciona
- [ ] Filtros aplicam
- [ ] "View All" funciona

### Details → Actions
- [x] Favoritar funciona
- [x] Ver reviews
- [ ] Nearby places mostram
- [ ] Open on Map funciona
- [ ] Add to Trip funciona
- [ ] Compartilhar funciona
- [ ] Escrever review funciona

### Map → Details
- [x] Tap em marker mostra callout
- [ ] Tap em callout vai para detalhes
- [ ] Details → Map funciona

### Autenticação
- [x] Login UI
- [x] Register UI
- [ ] Autenticação real
- [ ] Proteção de rotas
- [ ] Persistência de sessão

---

**Conclusão:** O fluxo básico funciona bem, mas falta implementar as ações dos botões e criar as telas de busca, trip planner e eventos. Foco imediato deve ser em tornar "Open on Map" e "Nearby Places" funcionais. 🎯
