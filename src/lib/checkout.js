import { db } from '../firebase/firebaseInit';
import { doc, collection, runTransaction, serverTimestamp } from 'firebase/firestore';

/**
 * handleCheckout verifies stock and creates an order using a Firestore Transaction.
 * Ensure that `auth.currentUser` is defined before calling.
 */
export const handleCheckout = async (userId, cartItems, shippingAddress, paymentMethod, addressObj = null) => {
  if (!userId) throw new Error("User must be logged in to checkout.");
  if (!cartItems || cartItems.length === 0) throw new Error("Cart is empty.");

  try {
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newOrderRef = doc(collection(db, 'orders'), orderId);
    
    // We will validate stock in a transaction
    await runTransaction(db, async (transaction) => {
      let total = 0;
      const parsedItems = [];
      const productRefs = [];

      // 1. Read all product documents to check stock
      for (const item of cartItems) {
        const productRef = doc(db, 'products', item.id);
        const productDoc = await transaction.get(productRef);
        
        if (!productDoc.exists()) {
          throw new Error(`Product ${item.name} does not exist.`);
        }

        const productData = productDoc.data();
        if (productData.stock_count < item.qty) {
          throw new Error(`Insufficient stock for ${item.name}. Available: ${productData.stock_count}`);
        }

        const priceToUse = productData.discountPrice || productData.price;
        total += priceToUse * item.qty;

        productRefs.push({ ref: productRef, newStock: productData.stock_count - item.qty });
        parsedItems.push({
          pid: item.id,
          name: item.name,
          qty: item.qty,
          price: priceToUse
        });
      }

      // 2. Perform writes: update stock and create order
      // Deduct stock
      for (const update of productRefs) {
        transaction.update(update.ref, { stock_count: update.newStock });
      }

      // Create Order
      const orderData = {
        orderId,
        userId,
        items: parsedItems,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
        orderStatus: 'placed',
        shippingAddress,
        shippingAddressObj: addressObj, // Enhanced persistence
        createdAt: serverTimestamp()
      };
      
      transaction.set(newOrderRef, orderData);

      // Save Last Address to User Profile for Professional Persistence
      const userRef = doc(db, 'users', userId);
      transaction.update(userRef, { 
        lastAddress: shippingAddress,
        lastAddressObj: addressObj, // Save the actual object for pre-filling
        updatedAt: serverTimestamp() 
      });
    });

    console.log(`Order ${orderId} created successfully via transaction.`);
    return { success: true, orderId };
    
  } catch (error) {
    console.error("Checkout Transaction Failed: ", error);
    return { success: false, error: error.message };
  }
};
