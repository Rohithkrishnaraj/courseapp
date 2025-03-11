import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function ListBox({children,classprops,navigationprops}) {
  return (
    <View className="w-full ">
      <TouchableOpacity className={classprops} onPress={navigationprops}> 
       {children}
      </TouchableOpacity> 
    </View>
  )
}