import { 
  getAppwriteDatabases, 
  getAppwriteClient,
  getStoredAppwriteConfig, 
  isAppwriteConnected, 
  APPWRITE_COLLECTIONS,
  Query,
  ID 
} from './appwriteClient';
import { CargoItem, Bid, Order, ChatMessage, NotificationItem, UserProfile } from '../types';

class AppwriteService {
  private realtimeUnsubscribe: (() => void) | null = null;

  private getDb() {
    return getAppwriteDatabases();
  }

  private getDbId() {
    return getStoredAppwriteConfig().databaseId || 'yuktop_db';
  }

  // --- CARGOS ---
  public async getCargos(): Promise<CargoItem[]> {
    const db = this.getDb();
    if (!db || !isAppwriteConnected()) return [];

    try {
      const res = await db.listDocuments(this.getDbId(), APPWRITE_COLLECTIONS.CARGOS, [
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]);
      return res.documents.map(doc => this.mapDocToCargo(doc));
    } catch (e) {
      console.warn('Appwrite getCargos error:', e);
      return [];
    }
  }

  public async createCargo(cargo: CargoItem): Promise<boolean> {
    const db = this.getDb();
    if (!db || !isAppwriteConnected()) return false;

    try {
      await db.createDocument(
        this.getDbId(),
        APPWRITE_COLLECTIONS.CARGOS,
        cargo.id || ID.unique(),
        {
          ownerId: cargo.ownerId,
          ownerName: cargo.ownerName,
          ownerPhone: cargo.ownerPhone,
          ownerTelegram: cargo.ownerTelegram || '',
          title: cargo.title,
          category: cargo.category,
          imageUrl: cargo.imageUrl,
          weightKg: cargo.weightKg,
          volumeM3: cargo.volumeM3,
          pickupCity: cargo.pickupLocation.city,
          pickupAddress: cargo.pickupLocation.address,
          pickupLat: cargo.pickupLocation.lat,
          pickupLng: cargo.pickupLocation.lng,
          deliveryCity: cargo.deliveryLocation.city,
          deliveryAddress: cargo.deliveryLocation.address,
          deliveryLat: cargo.deliveryLocation.lat,
          deliveryLng: cargo.deliveryLocation.lng,
          pickupDate: cargo.pickupDate,
          deliveryDate: cargo.deliveryDate,
          priceUzs: cargo.priceUzs,
          paymentMethod: cargo.paymentMethod,
          urgency: cargo.urgency,
          hasDocuments: cargo.hasDocuments,
          distanceKm: cargo.distanceKm,
          durationMinutes: cargo.durationMinutes,
          specialNotes: cargo.specialNotes || '',
          status: cargo.status,
          bidsCount: cargo.bidsCount || 0
        }
      );
      return true;
    } catch (e) {
      console.warn('Appwrite createCargo error:', e);
      return false;
    }
  }

  // --- BIDS ---
  public async createBid(bid: Bid): Promise<boolean> {
    const db = this.getDb();
    if (!db || !isAppwriteConnected()) return false;

    try {
      await db.createDocument(
        this.getDbId(),
        APPWRITE_COLLECTIONS.BIDS,
        bid.id || ID.unique(),
        {
          cargoId: bid.cargoId,
          driverId: bid.driverId,
          driverName: bid.driverName,
          driverPhone: bid.driverPhone,
          driverTelegram: bid.driverTelegram || '',
          driverRating: bid.driverRating,
          vehicleModel: bid.vehicleModel,
          vehiclePlate: bid.vehiclePlate,
          transportType: bid.transportType,
          vehicleCapacityTon: bid.vehicleCapacityTon,
          offeredPriceUzs: bid.offeredPriceUzs,
          proposedDate: bid.proposedDate,
          counterPriceUzs: bid.counterPriceUzs || null,
          counterNote: bid.counterNote || '',
          status: bid.status
        }
      );
      return true;
    } catch (e) {
      console.warn('Appwrite createBid error:', e);
      return false;
    }
  }

  // --- ORDERS ---
  public async createOrder(order: Order): Promise<boolean> {
    const db = this.getDb();
    if (!db || !isAppwriteConnected()) return false;

    try {
      await db.createDocument(
        this.getDbId(),
        APPWRITE_COLLECTIONS.ORDERS,
        order.id || ID.unique(),
        {
          orderCode: order.orderCode,
          cargoId: order.cargoId,
          cargoTitle: order.cargoTitle,
          category: order.category,
          weightKg: order.weightKg,
          volumeM3: order.volumeM3,
          paymentMethod: order.paymentMethod,
          urgency: order.urgency,
          hasDocuments: order.hasDocuments,
          ownerId: order.ownerId,
          ownerName: order.ownerName,
          ownerPhone: order.ownerPhone,
          driverId: order.driverId,
          driverName: order.driverName,
          driverPhone: order.driverPhone,
          vehicleModel: order.vehicleModel,
          vehiclePlate: order.vehiclePlate,
          transportType: order.transportType,
          pickupCity: order.pickupLocation.city,
          pickupAddress: order.pickupLocation.address,
          deliveryCity: order.deliveryLocation.city,
          deliveryAddress: order.deliveryLocation.address,
          agreedPriceUzs: order.agreedPriceUzs,
          distanceKm: order.distanceKm,
          status: order.status,
          driverLat: order.driverCurrentLocation.lat,
          driverLng: order.driverCurrentLocation.lng,
          driverSpeed: order.driverCurrentLocation.speedKmH
        }
      );
      return true;
    } catch (e) {
      console.warn('Appwrite createOrder error:', e);
      return false;
    }
  }

  public async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    const db = this.getDb();
    if (!db || !isAppwriteConnected()) return false;

    try {
      await db.updateDocument(
        this.getDbId(),
        APPWRITE_COLLECTIONS.ORDERS,
        orderId,
        { status }
      );
      return true;
    } catch (e) {
      console.warn('Appwrite updateOrderStatus error:', e);
      return false;
    }
  }

  // --- MESSAGES ---
  public async sendMessage(msg: ChatMessage): Promise<boolean> {
    const db = this.getDb();
    if (!db || !isAppwriteConnected()) return false;

    try {
      await db.createDocument(
        this.getDbId(),
        APPWRITE_COLLECTIONS.MESSAGES,
        msg.id || ID.unique(),
        {
          orderId: msg.orderId,
          senderId: msg.senderId,
          senderRole: msg.senderRole,
          senderName: msg.senderName,
          text: msg.text,
          isRead: msg.isRead
        }
      );
      return true;
    } catch (e) {
      console.warn('Appwrite sendMessage error:', e);
      return false;
    }
  }

  // --- REALTIME SUBSCRIPTION ---
  public subscribeToRealtime(callback: (payload: any) => void): () => void {
    const client = getAppwriteClient();
    if (!client || !isAppwriteConnected()) {
      return () => {};
    }

    try {
      const channel = `databases.${this.getDbId()}.collections`;
      const unsub = client.subscribe(channel, (response) => {
        callback(response);
      });
      return unsub;
    } catch (e) {
      console.warn('Appwrite Realtime subscription error:', e);
      return () => {};
    }
  }

  private mapDocToCargo(doc: any): CargoItem {
    return {
      id: doc.$id || doc.id,
      ownerId: doc.ownerId,
      ownerName: doc.ownerName,
      ownerPhone: doc.ownerPhone,
      ownerTelegram: doc.ownerTelegram,
      title: doc.title,
      category: doc.category,
      imageUrl: doc.imageUrl,
      weightKg: doc.weightKg,
      volumeM3: doc.volumeM3,
      pickupLocation: {
        city: doc.pickupCity,
        address: doc.pickupAddress,
        lat: doc.pickupLat,
        lng: doc.pickupLng
      },
      deliveryLocation: {
        city: doc.deliveryCity,
        address: doc.deliveryAddress,
        lat: doc.deliveryLat,
        lng: doc.deliveryLng
      },
      pickupDate: doc.pickupDate,
      deliveryDate: doc.deliveryDate,
      priceUzs: doc.priceUzs,
      paymentMethod: doc.paymentMethod,
      urgency: doc.urgency,
      hasDocuments: doc.hasDocuments,
      distanceKm: doc.distanceKm,
      durationMinutes: doc.durationMinutes,
      specialNotes: doc.specialNotes,
      status: doc.status,
      bidsCount: doc.bidsCount || 0,
      createdAt: doc.$createdAt || new Date().toISOString()
    };
  }
}

export const appwriteService = new AppwriteService();
