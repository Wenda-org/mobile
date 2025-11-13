/**
 * 🧪 TESTE RÁPIDO DE INTEGRAÇÃO API
 * 
 * Execute este arquivo para testar a conexão com as APIs
 */

import { destinationService, categoryService, mlService } from '../services';

export async function testCoreAPI() {
  console.log('🧪 Testando Core API...\n');

  try {
    // Teste 1: Listar Categorias
    console.log('📋 Teste 1: Listar Categorias');
    const categories = await categoryService.getCategories();
    if (categories.success && categories.data) {
      console.log(`✅ SUCESSO: ${categories.data.length} categorias encontradas`);
      categories.data.forEach(cat => {
        console.log(`   - ${cat.name} (${cat._count?.destinations || 0} destinos)`);
      });
    }
    console.log('');

    // Teste 2: Listar Destinos
    console.log('📋 Teste 2: Listar Destinos (primeira página)');
    const destinations = await destinationService.getDestinations({
      page: 1,
      perPage: 5,
    });
    if (destinations.success) {
      console.log(`✅ SUCESSO: ${destinations.meta.total} destinos totais`);
      console.log(`   Mostrando ${destinations.data.length} destinos:`);
      destinations.data.forEach(dest => {
        console.log(`   - ${dest.name} (${dest.location}) - ⭐ ${dest.rating}`);
      });
      console.log(`   Página ${destinations.meta.currentPage} de ${destinations.meta.totalPages}`);
    }
    console.log('');

    // Teste 3: Buscar por Província
    console.log('📋 Teste 3: Buscar Destinos em Luanda');
    const luandaDestinations = await destinationService.getDestinations({
      province: 'Luanda',
      perPage: 3,
    });
    if (luandaDestinations.success) {
      console.log(`✅ SUCESSO: ${luandaDestinations.data.length} destinos em Luanda`);
      luandaDestinations.data.forEach(dest => {
        console.log(`   - ${dest.name}`);
      });
    }
    console.log('');

    console.log('✅ CORE API: Todos os testes passaram!\n');
    return true;

  } catch (error: any) {
    console.error('❌ ERRO no Core API:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', error.response.data);
    } else if (error.request) {
      console.error('   Nenhuma resposta recebida. Verifique se o backend está rodando.');
    }
    return false;
  }
}

export async function testMLAPI() {
  console.log('🧪 Testando ML API...\n');

  try {
    // Teste 1: Health Check
    console.log('📋 Teste 1: Health Check');
    const health = await mlService.healthCheck();
    console.log(`✅ SUCESSO: Status ${health.status}`);
    console.log(`   Modelos treinados: ${health.trained_models}`);
    console.log(`   Endpoints: ${health.endpoints.join(', ')}`);
    console.log('');

    // Teste 2: Listar Modelos
    console.log('📋 Teste 2: Listar Modelos ML');
    const models = await mlService.getModels();
    console.log(`✅ SUCESSO: ${models.total_models} modelos`);
    console.log(`   Forecast: ${models.by_type.forecast}`);
    console.log(`   Clustering: ${models.by_type.clustering}`);
    console.log(`   Recommender: ${models.by_type.recommender}`);
    console.log('');

    // Teste 3: Previsão
    console.log('📋 Teste 3: Previsão de Visitantes');
    const forecast = await mlService.forecast({
      province: 'Luanda',
      month: 12,
      year: 2025,
    });
    console.log(`✅ SUCESSO: Previsão obtida`);
    console.log(`   Província: ${forecast.province}`);
    console.log(`   Mês/Ano: ${forecast.month}/${forecast.year}`);
    console.log(`   Visitantes previstos: ${forecast.predicted_visitors}`);
    console.log(`   Intervalo: ${forecast.confidence_interval.lower} - ${forecast.confidence_interval.upper}`);
    console.log('');

    // Teste 4: Recomendações
    console.log('📋 Teste 4: Recomendações');
    const recommendations = await mlService.getRecommendations({
      user_preferences: {
        preferred_categories: ['natural'],
        preferred_provinces: ['Luanda'],
      },
      top_n: 3,
    });
    console.log(`✅ SUCESSO: ${recommendations.total_recommendations} recomendações`);
    recommendations.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec.destination_name} (Score: ${rec.similarity_score.toFixed(2)})`);
    });
    console.log('');

    console.log('✅ ML API: Todos os testes passaram!\n');
    return true;

  } catch (error: any) {
    console.error('❌ ERRO no ML API:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', error.response.data);
    } else if (error.request) {
      console.error('   Nenhuma resposta recebida. Verifique a URL da ML API.');
    }
    return false;
  }
}

export async function runAllTests() {
  console.log('═══════════════════════════════════════════════════');
  console.log('🚀 WENDA - TESTE DE INTEGRAÇÃO API');
  console.log('═══════════════════════════════════════════════════\n');

  const coreResult = await testCoreAPI();
  const mlResult = await testMLAPI();

  console.log('═══════════════════════════════════════════════════');
  console.log('📊 RESULTADO FINAL');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Core API: ${coreResult ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`ML API: ${mlResult ? '✅ OK' : '❌ FALHOU'}`);
  console.log('═══════════════════════════════════════════════════\n');

  return coreResult && mlResult;
}

// Uso:
// import { runAllTests } from '@/tests/apiIntegrationTest';
// runAllTests();
