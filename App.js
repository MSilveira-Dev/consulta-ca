import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';

export default function App() {
  const [ca, setCa] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  async function consultarCA() {
    if (!ca.trim()) {
      Alert.alert("Erro", "Digite um número de CA");
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const response = await fetch(`http://192.168.1.8:5000/consulta/${ca}`);
      const data = await response.json();

      setResultado(data);

    } catch (error) {
      setResultado({
        erro: "Erro ao conectar com o servidor"
      });
    }

    setLoading(false);
  }

  function corSituacao(situacao) {
    if (situacao === "VÁLIDO") return "green";
    if (situacao === "VENCIDO") return "red";
    return "black";
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Consulta de CA</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o número do CA"
        keyboardType="numeric"
        value={ca}
        onChangeText={setCa}
      />

      <TouchableOpacity style={styles.botao} onPress={consultarCA}>
        <Text style={styles.botaoTexto}>Consultar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007bff" />}

      {resultado && (
        <View style={styles.card}>
          {resultado.erro ? (
            <Text style={styles.erro}>{resultado.erro}</Text>
          ) : (
            <>
              <Text style={styles.label}>CA:</Text>
              <Text style={styles.valor}>{resultado.ca}</Text>

              <Text style={styles.label}>Razão Social:</Text>
              <Text style={styles.valor}>{resultado.razao_social}</Text>

              <Text style={styles.label}>Tipo do Equipamento:</Text>
              <Text style={styles.valor}>{resultado.tipo_equipamento}</Text>

              <Text style={styles.label}>Validade:</Text>
              <Text style={styles.valor}>{resultado.validade}</Text>

              <Text style={styles.label}>Situação:</Text>
              <Text style={[styles.valor, { color: corSituacao(resultado.situacao) }]}>
                {resultado.situacao}
              </Text>
            </>
          )}
        </View>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 14,
  },
  valor: {
    fontSize: 15,
  },
  erro: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  }
});