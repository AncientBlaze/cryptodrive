import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function About() {
  return (
    <View style={styles.screen}>
      <Text>About</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    padding:20,
    margin:20,
    backgroundColor:"blue"
  }
})