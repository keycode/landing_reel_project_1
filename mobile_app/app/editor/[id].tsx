import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReelStore } from '@landingreel/store';

export default function EditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { shots, setShots, activeIndex, setActiveIndex, updateElement } = useReelStore();
  
  useEffect(() => {
    // Mock initializing
    if (shots.length === 0 || id === 'new') {
      setShots([
        { 
          id: "slide-1", 
          type: "text", 
          shotData: { 
            navLabel: "Intro",
            elements: [
              { id: "e1", type: "text", content: "Main Header", role: "primary-text" },
              { id: "e2", type: "text", content: "Sub Header", role: "secondary-text" }
            ]
          } 
        }
      ]);
    }
  }, [id, setShots, shots.length]);

  const currentShot = shots[activeIndex];

  return (
    <SafeAreaView className="flex-1 bg-zinc-50">
      <View className="flex-row items-center p-4 border-b border-neutral-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-orange-500 font-semibold text-base">{"< Back"}</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-neutral-900">Editor: {id}</Text>
      </View>
      
      <ScrollView className="flex-1">
        {/* Horizontal scroll for Sidebar "Slides" */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="flex-row p-4 bg-white border-b border-neutral-200 h-[75px]"
        >
          {shots.map((shot, index) => {
            const isActive = activeIndex === index;
            return (
              <TouchableOpacity 
                key={shot.id} 
                className={`px-4 py-2 rounded-full mr-3 ${isActive ? 'bg-neutral-900' : 'bg-neutral-100'}`}
                onPress={() => setActiveIndex(index)}
              >
                <Text className={`font-semibold ${isActive ? 'text-white' : 'text-neutral-600'}`}>
                  {shot.shotData?.navLabel || `Slide ${index+1}`}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        
        {/* Mobile Slide Preview Canvas & Forms */}
        {currentShot && currentShot.shotData?.elements && (
          <View className="p-4">
             <Text className="text-lg font-bold mb-4 text-neutral-900">Elements</Text>
             {currentShot.shotData.elements.map(el => (
               <View key={el.id} className="bg-white p-4 rounded-xl mb-4 border border-neutral-200">
                 <View className="flex-row justify-between mb-2">
                    <Text className="text-sm font-bold text-neutral-800 uppercase">{el.type}</Text>
                    <View className="bg-blue-100 px-2 py-1 rounded-md overflow-hidden">
                      <Text className="text-xs text-blue-600">{el.role || "generic"}</Text>
                    </View>
                 </View>
                 <TextInput 
                   className="border border-neutral-300 rounded-lg p-3 text-base text-neutral-900 bg-white"
                   value={el.content}
                   onChangeText={(text) => updateElement(currentShot.id, el.id, { content: text })}
                   placeholder={`Edit ${el.type}...`}
                 />
               </View>
             ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
