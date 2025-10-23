// Example of how to use the useAuth hook in your components

import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function ExampleAuthComponent() {
  const { user, isLoading, login, logout, loginWithGoogle } = useAuth();

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (user) {
    return (
      <View>
        <Text>Welcome, {user.name}!</Text>
        <Text>Email: {user.email}</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  return (
    <View>
      <Text>Not logged in</Text>
      <Button 
        title="Login with Email" 
        onPress={() => login('test@example.com', 'password')} 
      />
      <Button 
        title="Login with Google" 
        onPress={loginWithGoogle} 
      />
    </View>
  );
}
