import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const mockLandings = [
  { id: "1", title: "Summer Campaign 2026", status: "Active", views: 1240 },
  { id: "2", title: "Feature Showcase: Magic Edit", status: "Draft", views: 0 },
  { id: "3", title: "Legacy Winter Promo", status: "Expired", views: 8900 },
];

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-zinc-50">
      <ScrollView contentContainerClassName="p-5">
        <Text className="text-3xl font-extrabold text-neutral-900">LandingReel</Text>
        <Text className="text-base text-neutral-600 mt-1 mb-5">Manage your swipable pages</Text>
        
        <TouchableOpacity 
          className="bg-orange-500 p-4 rounded-xl items-center mb-8 shadow-sm"
          onPress={() => router.push('/editor/new')}
        >
          <Text className="text-white text-base font-bold">+ Create New Reel</Text>
        </TouchableOpacity>
        
        <View className="mb-3">
          <Text className="text-xl font-bold">My Reels</Text>
        </View>
        
        <View className="space-y-4 flex flex-col gap-4">
          {mockLandings.map((landing) => (
            <View key={landing.id} className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
              <View className="h-40 bg-neutral-100 justify-center items-center relative">
                <Text className="text-4xl font-black text-neutral-300">9:16</Text>
                <View className="absolute top-3 right-3 bg-blue-100 px-2 py-1 rounded-full border border-blue-200">
                  <Text className="text-xs font-semibold text-blue-600">{landing.status}</Text>
                </View>
              </View>

              <View className="p-4">
                <Text className="text-lg font-bold mb-1">{landing.title}</Text>
                <Text className="text-sm text-neutral-500 mb-4">{landing.views} views</Text>
                
                <View className="flex-row gap-3">
                  <TouchableOpacity 
                    className="flex-1 py-2 border border-neutral-300 rounded-lg items-center"
                    onPress={() => router.push(`/editor/${landing.id}`)}
                  >
                    <Text className="text-neutral-800 font-semibold">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 py-2 bg-neutral-900 rounded-lg items-center">
                     <Text className="text-white font-semibold">Preview</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
