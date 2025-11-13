# 🛠️ Comandos Úteis - API Integration

## 🧪 Testar Conectividade

### Core API

```bash
# Health check básico
curl http://192.168.100.10:3000/api/destinations

# Listar categorias
curl http://192.168.100.10:3000/api/categories

# Testar paginação
curl "http://192.168.100.10:3000/api/destinations?page=1&perPage=5"

# Filtrar por província
curl "http://192.168.100.10:3000/api/destinations?province=Luanda"

# Buscar
curl "http://192.168.100.10:3000/api/destinations?search=praia"
```

### ML API

```bash
# Health check
curl https://backend-ml-c75p.onrender.com/api/ml/health

# Listar modelos
curl https://backend-ml-c75p.onrender.com/api/ml/models

# Previsão
curl -X POST "https://backend-ml-c75p.onrender.com/api/ml/forecast" \
  -H "Content-Type: application/json" \
  -d '{
    "province": "Luanda",
    "month": 12,
    "year": 2025
  }'

# Recomendações
curl -X POST "https://backend-ml-c75p.onrender.com/api/ml/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "user_preferences": {
      "preferred_categories": ["natural"],
      "preferred_provinces": ["Luanda"]
    },
    "top_n": 5
  }'
```

## 📱 Comandos React Native

### Limpar Cache

```bash
# Limpar cache do Metro
npx react-native start --reset-cache

# Limpar cache do Expo
npx expo start -c

# Limpar tudo
rm -rf node_modules
npm install
npx expo start -c
```

### Debug

```bash
# Ver logs do iOS
npx react-native log-ios

# Ver logs do Android
npx react-native log-android

# Expo logs
npx expo start
```

### AsyncStorage

```bash
# No console do app (Chrome DevTools):
import AsyncStorage from '@react-native-async-storage/async-storage';

# Ver token
AsyncStorage.getItem('@wenda_access_token').then(console.log);

# Ver usuário
AsyncStorage.getItem('@wenda_user').then(console.log);

# Limpar tudo
AsyncStorage.clear();

# Ver todas as chaves
AsyncStorage.getAllKeys().then(console.log);
```

## 🔧 Desenvolvimento

### Alterar IP do Backend

```bash
# 1. Descobrir IP do backend
hostname -I  # Linux
ipconfig     # Windows
ifconfig     # Mac

# 2. Editar arquivo
# services/api.config.ts
# Linha 4: baseURL: 'http://SEU_IP:3000/api'
```

### Teste Rápido no Console

```typescript
// Adicione no app.json ou em qualquer componente:
import { runAllTests } from '@/tests/apiIntegrationTest';

useEffect(() => {
  if (__DEV__) {
    runAllTests();
  }
}, []);
```

## 🐛 Debug de Problemas

### Network Error

```bash
# 1. Verificar se backend está rodando
curl http://192.168.100.10:3000/api/destinations

# 2. Verificar firewall (Linux/Mac)
sudo ufw status
sudo ufw allow 3000

# 3. Ping para verificar rede
ping 192.168.100.10

# 4. Testar com outro dispositivo
# Use Postman ou navegador
```

### CORS Issues

```bash
# No backend, adicionar origem:
# app.use(cors({
#   origin: ['http://localhost:19006', 'http://192.168.100.X']
# }))
```

### Token Issues

```typescript
// Verificar token no console
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.getItem('@wenda_access_token').then(token => {
  console.log('Token:', token);
  if (token) {
    console.log('Token decodificado:', JSON.parse(atob(token.split('.')[1])));
  }
});

// Limpar token
AsyncStorage.removeItem('@wenda_access_token');
AsyncStorage.removeItem('@wenda_user');
```

## 📊 Monitoramento

### Ver Requisições em Tempo Real

```typescript
// Adicione em api.config.ts (desenvolvimento)
if (__DEV__) {
  coreApi.interceptors.request.use(config => {
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    console.log('📤 Data:', config.data);
    return config;
  });

  coreApi.interceptors.response.use(
    response => {
      console.log('📥 Response:', response.status, response.config.url);
      console.log('📥 Data:', response.data);
      return response;
    },
    error => {
      console.error('❌ Error:', error.config?.url, error.message);
      return Promise.reject(error);
    }
  );
}
```

### Métricas de Performance

```typescript
// Adicione em api.config.ts
coreApi.interceptors.request.use(config => {
  config.metadata = { startTime: new Date() };
  return config;
});

coreApi.interceptors.response.use(response => {
  const duration = new Date() - response.config.metadata.startTime;
  console.log(`⏱️ ${response.config.url} - ${duration}ms`);
  return response;
});
```

## 🔍 Inspeção de Dados

### Ver estrutura de resposta

```bash
# Com jq (JSON formatter)
curl -s http://192.168.100.10:3000/api/destinations | jq '.'

# Com python
curl -s http://192.168.100.10:3000/api/destinations | python3 -m json.tool

# Salvar em arquivo
curl http://192.168.100.10:3000/api/destinations > response.json
```

### Contar registros

```bash
# Total de destinos
curl -s "http://192.168.100.10:3000/api/destinations" | jq '.meta.total'

# Por província
curl -s "http://192.168.100.10:3000/api/destinations?province=Luanda" | jq '.meta.total'
```

## 🧹 Limpeza

```bash
# Limpar node_modules
rm -rf node_modules package-lock.json
npm install

# Limpar cache do iOS
cd ios && pod deintegrate && pod install && cd ..

# Limpar build do Android
cd android && ./gradlew clean && cd ..

# Rebuild completo
rm -rf node_modules ios/Pods ios/build android/build
npm install
cd ios && pod install && cd ..
```

## 📋 Atalhos Úteis

```bash
# Criar alias no .bashrc ou .zshrc
alias test-core="curl http://192.168.100.10:3000/api/destinations"
alias test-ml="curl https://backend-ml-c75p.onrender.com/api/ml/health"
alias clear-cache="npx expo start -c"
alias run-tests="node -e \"require('./tests/apiIntegrationTest').runAllTests()\""
```

## 🎯 Workflow de Desenvolvimento

```bash
# 1. Verificar backends
test-core && test-ml

# 2. Limpar cache (se necessário)
npx expo start -c

# 3. Iniciar app
npx expo start

# 4. Testar no app
# Adicionar <ApiTestButton /> e clicar em testar

# 5. Desenvolver feature
# Usar serviços e hooks

# 6. Testar
# Verificar logs e comportamento
```

## 🚀 Deploy/Build

```bash
# iOS
npx expo build:ios

# Android
npx expo build:android

# OTA Update
npx expo publish
```

---

**💡 Dica:** Salve estes comandos em um arquivo `commands.sh` para referência rápida!
