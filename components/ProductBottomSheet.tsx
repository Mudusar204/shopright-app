import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import BottomSheet, { BottomSheetProps , BottomSheetView} from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import ProductItem from './ProductItem';
import { useColorScheme } from './useColorScheme';
interface ProductBottomSheetProps extends Partial<BottomSheetProps> {
  products: Array<{
    id: string;
    image: any;
    title: string;
    location: string;
    price: string;
    phoneNumber: string;
  }>;
}

const ProductBottomSheet = React.forwardRef<BottomSheet, ProductBottomSheetProps>(
  ({ products, ...props }, ref) => {
    const colorScheme = useColorScheme() as 'light' | 'dark';
    const styles = createStyles(colorScheme);

    return (
        <BottomSheet
          ref={ref}
          index={-1}
          snapPoints={['25%', '50%', '90%']}
          enablePanDownToClose
          backgroundStyle={{
          backgroundColor: Colors[colorScheme].background,
        }}
        {...props}
      >
         <BottomSheetView style={styles.content}>  
          <Text style={styles.title}>{products.length} listings available</Text>
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <ProductItem
                image={item.image}
                title={item.title}
                location={item.location}
                price={item.price}
                phoneNumber={item.phoneNumber}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const createStyles = (colorTheme: 'light' | 'dark') => StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors[colorTheme].text,
  },
  list: {
    paddingBottom: 20,
  },
});

export default ProductBottomSheet; 