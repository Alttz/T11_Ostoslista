import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglistdb.db');

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppinglist, setShoppinglist] = useState([]);


  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, product text, amount text);');
    }, () => console.error("Error when creating DB"), updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppinglist (product, amount) values (?, ?);',
        [product, amount]);
    }, null, updateList)
  };

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) =>
        setShoppinglist(rows._array)
      );
    }, null, null);
  };

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
      }, null, updateList
    )
  }


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder='Product'
        onChangeText={product => setProduct(product)}
        value={product} />
      <TextInput
        style={styles.textInput}
        placeholder='Amount'
        onChangeText={amount => setAmount(amount)}
        value={amount} />
      <Button onPress={saveItem} title="Save" />
      <Text style={styles.header}>Shopping list</Text>
      <FlatList
        style={{ marginLeft: "5%" }}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.listcontainer}>
            <Text>{item.product},{item.amount} </Text>
            <Text style={{ marginLeft: 5, color: '#0000ff' }} onPress={() => deleteItem(item.id)}>bought</Text>
          </View>}
        data={shoppinglist}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textInput: {
    width: '90%',             
    height: 40,               
    padding: 10,             
    borderColor: '#ccc',      
    borderWidth: 1,         
    borderRadius: 5,     
    backgroundColor: '#fff', 
    color: '#333',         
    fontSize: 16,           
    marginBottom: 10,       
    shadowColor: '#000',   
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,   
    shadowRadius: 1.41,
    elevation: 2,            
  },
  header: {
    fontWeight: 'bold',      // Make text bolder
    marginVertical: 10,      // Add vertical margin to the top and bottom
    marginHorizontal: 15,    // Add horizontal margin to the left and right
    fontSize: 20,            // Slightly larger font size
  },
  
});