/**
 * 🧪 Componente de Teste de API
 * 
 * Adicione este componente em qualquer tela para testar a integração
 * Exemplo: import ApiTestButton from '@/components/ApiTestButton';
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { runAllTests } from '../tests/apiIntegrationTest';

export default function ApiTestButton() {
  const [showModal, setShowModal] = useState(false);
  const [testing, setTesting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runTests = async () => {
    setTesting(true);
    setLogs([]);

    // Capturar console.log
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      const message = args.join(' ');
      setLogs(prev => [...prev, message]);
      originalLog(...args);
    };

    console.error = (...args) => {
      const message = '❌ ' + args.join(' ');
      setLogs(prev => [...prev, message]);
      originalError(...args);
    };

    try {
      await runAllTests();
    } catch (error) {
      console.error('Erro ao executar testes:', error);
    } finally {
      // Restaurar console
      console.log = originalLog;
      console.error = originalError;
      setTesting(false);
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        className="absolute bottom-20 right-4 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
      >
        <Ionicons name="flask" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal de Testes */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-20 bg-white dark:bg-gray-900 rounded-t-3xl">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center">
                <Ionicons name="flask" size={24} color="#136F63" />
                <Text className="text-xl font-bold ml-2 text-gray-900 dark:text-white">
                  Teste de API
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Botão de Teste */}
            <View className="p-4">
              <TouchableOpacity
                onPress={runTests}
                disabled={testing}
                className={`bg-primary rounded-xl p-4 flex-row items-center justify-center ${testing ? 'opacity-50' : ''}`}
              >
                {testing ? (
                  <>
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-bold ml-2">Testando...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="play" size={20} color="white" />
                    <Text className="text-white font-bold ml-2">Executar Testes</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Logs */}
            <ScrollView className="flex-1 px-4 pb-4">
              {logs.length === 0 ? (
                <View className="items-center justify-center py-12">
                  <Ionicons name="information-circle-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
                    Clique em "Executar Testes" para verificar{'\n'}a conexão com as APIs
                  </Text>
                </View>
              ) : (
                <View className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                  {logs.map((log, index) => (
                    <Text
                      key={index}
                      className="text-xs font-mono mb-1 text-gray-800 dark:text-gray-200"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {log}
                    </Text>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Footer */}
            <View className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Text className="text-xs text-center text-gray-500 dark:text-gray-400">
                Core API: backend-core-v42h.onrender.com{'\n'}
                ML API: backend-ml-c75p.onrender.com
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
