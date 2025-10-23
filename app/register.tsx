import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // lógica de registro aqui
    console.log("Register:", name, email, password);
    // Exemplo: após registrar, vai para login
    router.replace("/login");
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-6">
      <Text className="text-3xl font-bold mb-6">Register</Text>

      <TextInput
        className="w-full bg-white p-4 rounded mb-4 border border-gray-300"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
        className="w-full bg-green-500 p-4 rounded mb-4"
        onPress={handleRegister}
      >
        <Text className="text-white text-center font-bold">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text className="text-blue-500">Already have an account?</Text>
      </TouchableOpacity>
    </View>
  );
}
