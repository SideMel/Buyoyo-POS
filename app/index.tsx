import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Products {
  product_id: number | string;
  product_name: string;
  product_price: number;
  product_type_id: number;
  stock: number;
  cup_size: string;
}

export default function App() {
  const [Products, setProducts] = useState<Products[]>([]);
  const [cart, setCart] = useState<Products[]>([]);

  useEffect(() => {
    fetch('http://192.168.55.109:3000/Products') 
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error loading products:", error));
  }, []);

  const addToCart = (product: Products) => {
    setCart([...cart, product]);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.product_price, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      return Alert.alert("Wait!", "The cart is empty.");
    }

    fetch('http://192.168.55.109:3000/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, total: calculateTotal() })
    })
    .then(response => response.json())
    .then(data => {
      Alert.alert("Success!", "Sale recorded.");
      setCart([]); 
    })
    .catch(error => console.error("Checkout failed:", error));
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      
      {/* Product Grid Section */}
      <View className="flex-[3] px-4 pt-3">
        <Text className="text-3xl font-extrabold text-slate-900 mb-4 tracking-wide">
          Menu
        </Text>
        <FlatList
          data={Products}
          numColumns={2}
          keyExtractor={(item) => item.product_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="flex-1 bg-white m-1.5 rounded-2xl shadow-sm"
              activeOpacity={0.7}
              onPress={() => addToCart(item)}
            >
              <View className="p-4 items-center justify-center min-h-[110px]">
                <Text className="text-base font-bold text-slate-800 text-center mb-1" numberOfLines={2}>
                  {item.product_name}
                </Text>
                {item.cup_size ? (
                  <Text className="text-xs text-slate-400 mb-2 uppercase font-semibold">
                    {item.cup_size}
                  </Text>
                ) : null}
                <Text className="text-base font-extrabold text-red-500">
                  ₱{item.product_price.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Shopping Cart Section */}
      <View className="flex-[2] bg-white px-5 pt-5 rounded-t-[30px] shadow-lg">
        <View className="flex-row items-center mb-4">
          <Text className="text-xl font-bold text-slate-900">Current Order</Text>
          <View className="bg-blue-100 px-3 py-1 rounded-full ml-3">
            <Text className="text-blue-600 font-bold text-sm">{cart.length}</Text>
          </View>
        </View>

        {cart.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-slate-400 text-base italic">Tap a product to add it to your order.</Text>
          </View>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="flex-row justify-between items-center py-3.5 border-b border-slate-100">
                <Text className="text-base text-slate-600 font-medium flex-1 pr-2" numberOfLines={1}>
                  {item.product_name}
                </Text>
                <Text className="text-base text-slate-900 font-bold">
                  ₱{item.product_price.toFixed(2)}
                </Text>
              </View>
            )}
          />
        )}
        
        {/* Checkout Bar */}
        <View className="flex-row justify-between items-center mt-3 py-5 border-t border-slate-100">
          <View className="flex-col">
            <Text className="text-sm text-slate-500 font-semibold mb-0.5">Total</Text>
            <Text className="text-2xl font-black text-slate-900">
              ₱{calculateTotal().toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity 
            className={`py-3.5 px-8 rounded-2xl items-center shadow-sm ${
              cart.length === 0 ? 'bg-slate-200' : 'bg-emerald-400'
            }`}
            onPress={handleCheckout}
            activeOpacity={0.8}
            disabled={cart.length === 0}
          >
            <Text className={`text-lg font-extrabold tracking-wide ${
              cart.length === 0 ? 'text-slate-400' : 'text-white'
            }`}>
              Charge
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}