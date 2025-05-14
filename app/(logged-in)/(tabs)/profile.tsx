import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Text } from 'react-native';

export default function ProfileScreen() {
    return (
        <ThemedView style={styles.container}>
        <Text>ProfileScreen</Text>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});