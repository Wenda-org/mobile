# 🚀 Início Rápido - Integração API

## ⚡ Primeiros Passos (5 minutos)

### 1. Verificar Backend

Certifique-se de que o backend está rodando:

```bash
# Core API
curl http://192.168.100.10:3000/api/destinations

# ML API
curl https://backend-ml-c75p.onrender.com/api/ml/health
```

### 2. Testar Integração no App

Adicione o botão de teste em qualquer tela:

```typescript
// app/(tabs)/index.tsx ou qualquer tela
import ApiTestButton from '@/components/ApiTestButton';

export default function MyScreen() {
  return (
    <View>
      {/* seu conteúdo */}
      
      {/* Botão de teste (só em desenvolvimento) */}
      {__DEV__ && <ApiTestButton />}
    </View>
  );
}
```

Clique no botão de teste (ícone de frasco) e execute os testes!

### 3. Usar nos Componentes

#### Exemplo 1: Listar Destinos

```typescript
import { useEffect, useState } from 'react';
import { destinationService } from '@/services';

export default function DiscoverScreen() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const response = await destinationService.getDestinations({
        page: 1,
        perPage: 20,
        sortBy: 'rating'
      });
      
      if (response.success) {
        setDestinations(response.data);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // render...
}
```

#### Exemplo 2: Sistema de Favoritos

```typescript
import { favoriteService } from '@/services';

// Adicionar favorito
const handleFavorite = async (destinationId: string) => {
  try {
    const response = await favoriteService.addFavorite({ destinationId });
    if (response.success) {
      Alert.alert('Sucesso', 'Adicionado aos favoritos!');
    }
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível adicionar');
  }
};

// Remover favorito
const handleUnfavorite = async (favoriteId: string) => {
  try {
    await favoriteService.removeFavorite(favoriteId);
    Alert.alert('Sucesso', 'Removido dos favoritos!');
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível remover');
  }
};
```

#### Exemplo 3: Login

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password });
    
    if (response.success && response.data) {
      // Salvar token
      await AsyncStorage.setItem('@wenda_access_token', response.data.accessToken);
      await AsyncStorage.setItem('@wenda_user', JSON.stringify(response.data.user));
      
      // Navegar
      router.replace('/(tabs)');
    }
  } catch (error: any) {
    Alert.alert('Erro', error.response?.data?.message || 'Erro ao fazer login');
  }
};
```

#### Exemplo 4: Recomendações ML

```typescript
import { mlService } from '@/services';

const getRecommendations = async () => {
  try {
    const response = await mlService.getRecommendations({
      user_preferences: {
        preferred_categories: ['natural', 'historical'],
        preferred_provinces: ['Luanda'],
      },
      top_n: 10
    });
    
    console.log('Recomendações:', response.recommendations);
    setRecommendedDestinations(response.recommendations);
  } catch (error) {
    console.error('Erro ao obter recomendações:', error);
  }
};
```

## 🔧 Configuração

### Alterar IP do Backend

Se o IP do backend mudar, edite:

```typescript
// services/api.config.ts
export const coreApi = axios.create({
  baseURL: 'http://SEU_NOVO_IP:3000/api',  // ← Altere aqui
  // ...
});
```

### Desabilitar Timeout

Para requisições que demoram mais:

```typescript
// services/api.config.ts
export const coreApi = axios.create({
  baseURL: 'http://192.168.100.10:3000/api',
  timeout: 30000, // 30 segundos
});
```

## 📚 Próximos Passos

1. ✅ Testar integração com botão de teste
2. ✅ Implementar login/registro
3. ✅ Carregar destinos reais
4. ✅ Implementar favoritos
5. ✅ Adicionar reviews
6. ✅ Integrar recomendações ML

## 🎯 Hooks Prontos para Usar

```typescript
// hooks/useDestinations.ts
import { useDestinations } from '@/hooks/useDestinations';

const { destinations, loading, fetchDestinations } = useDestinations();

useEffect(() => {
  fetchDestinations({ province: 'Luanda' });
}, []);
```

```typescript
// hooks/useFavorites.ts
import { useFavorites } from '@/hooks/useFavorites';

const { favorites, addFavorite, removeFavorite } = useFavorites();
```

```typescript
// hooks/useML.ts
import { useForecast } from '@/hooks/useML';

const { forecast, loading, getForecast } = useForecast();
```

## 📖 Documentação Completa

- `docs/API_INTEGRATION.md` - Documentação completa
- `examples/ApiUsageExamples.tsx` - Exemplos de código
- `docs/API_QUICK_REFERENCE.md` - Referência rápida da API

## 🆘 Problemas Comuns

### Network Error

❌ **Problema:** `Network Error / ECONNREFUSED`

✅ **Solução:**
1. Verificar se o backend está rodando
2. Testar com curl: `curl http://192.168.100.10:3000/api/destinations`
3. Verificar firewall/rede

### Token Expired (401)

❌ **Problema:** `Unauthorized / 401`

✅ **Solução:**
```typescript
// Limpar e fazer login novamente
await AsyncStorage.clear();
// Fazer login
```

### CORS Error

❌ **Problema:** `CORS policy`

✅ **Solução:** Configurar CORS no backend para aceitar requests do app

---

**🎉 Pronto! A integração está configurada e pronta para uso.**
