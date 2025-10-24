import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // lógica de login aqui
    console.log("Login:", email, password);
    // Exemplo: depois do login, vai para a aba principal
    router.replace("/(tabs)/map");
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-6">
      <Text className="text-3xl font-bold mb-6">Login</Text>

      <TextInput
        className="w-full bg-white p-4 rounded mb-4 border border-gray-300"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-full bg-white p-4 rounded mb-4 border border-gray-300"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="w-full bg-blue-500 p-4 rounded mb-4"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-bold">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text className="text-blue-500">Create account</Text>
      </TouchableOpacity>
    </View>
  );
}
