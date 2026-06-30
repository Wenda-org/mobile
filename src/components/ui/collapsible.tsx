import React, { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FadeInView } from '@/components/animated-wrappers';
import { ChevronRight } from 'lucide-react-native';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="bg-surface-light dark:bg-surface-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-md mb-2 overflow-hidden">
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center justify-between p-4"
      >
        <Text className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
          {title}
        </Text>
        <ChevronRight 
          size={16} 
          color="#136F63"
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
      </Pressable>
      {isOpen && (
        <FadeInView duration={200} className="px-4 pb-4 border-t border-borderSubtle-light dark:border-borderSubtle-dark pt-3">
          {children}
        </FadeInView>
      )}
    </View>
  );
}
