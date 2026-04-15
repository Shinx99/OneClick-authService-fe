"use client";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getAccessToken } from "@/lib/apiClient/api.config";

let sharedClient = null;
const subscriptions = new Map();
let isActivating = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let isDisconnecting = false;

const socketUrl = `${process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080"}/ws`;

function subscriptionKey(destination, userId = null) {
  return userId ? `${destination}:${userId}` : destination;
}

function ensureSubscriptions() {
  if (!sharedClient?.connected) {
    console.log("🔵 [STOMP] Cannot ensure subscriptions - client not connected");
    return;
  }

  console.log(`🔵 [STOMP] Ensuring ${subscriptions.size} subscriptions`);
  subscriptions.forEach((entry, key) => {
    if (entry.stompSubscription) {
      console.log(`   - Already subscribed: ${entry.destination}`);
      return;
    }

    console.log(`🔵 [STOMP] Subscribing to: ${entry.destination}`);
    try {
      entry.stompSubscription = sharedClient.subscribe(
        entry.destination,
        (message) => {
          console.log(`📨 [STOMP] Message received on ${entry.destination}`);
          try {
            entry.callback(message);
          } catch (err) {
            console.error(`🔴 [STOMP] Callback error for ${entry.destination}:`, err);
          }
        }
      );
      console.log(`✅ [STOMP] Subscribed to ${entry.destination}`);
    } catch (err) {
      console.error(`🔴 [STOMP] Failed to subscribe to ${entry.destination}:`, err);
    }
  });
}

export function createChatStompClient({
  accessToken,
  onConnect,
  onStompError,
  subscribeTopics = [],
  userId = null,
} = {}) {
  if (typeof window === "undefined") return null;

  if (isActivating) {
    console.log("🔵 [STOMP] Already activating, skipping...");
    return sharedClient;
  }

  const token = accessToken || getAccessToken();
  console.log("🔵 [STOMP] Creating client, token present:", !!token);
  
  const connectHeaders = token ? { 
    'Authorization': `Bearer ${token}`,
  } : {};

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("🔵 [STOMP] Token roles:", payload.roles);
      console.log("🔵 [STOMP] Token sub:", payload.sub);
    } catch (e) {
      console.log("🔵 [STOMP] Token decode failed:", e.message);
    }
  }
  
  const wsUrlWithToken = token ? `${socketUrl}?access_token=${token}` : socketUrl;
  console.log("🔵 [STOMP] Socket URL:", wsUrlWithToken);

  if (!sharedClient) {
    console.log("🔵 [STOMP] Creating new STOMP client instance");
    isActivating = true;

    sharedClient = new Client({
      webSocketFactory: () => {
        console.log("🔵 [STOMP] Creating SockJS connection to:", wsUrlWithToken);
        const sock = new SockJS(wsUrlWithToken);
        
        sock.onopen = () => console.log("🔵 [STOMP] SockJS onopen");
        sock.onclose = (e) => console.log("🔴 [STOMP] SockJS onclose:", e.code, e.reason);
        sock.onerror = (e) => console.error("🔴 [STOMP] SockJS onerror:", e);
        
        return sock;
      },
      connectHeaders: connectHeaders,
      reconnectDelay: 3000,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
      connectionTimeout: 10000,
      // ✅ SỬA: debug phải là function, không phải boolean
      debug: (str) => {
        // Tắt debug log để tránh spam, nhưng vẫn là function hợp lệ
        if (process.env.NODE_ENV === 'development' && false) {
          console.log('[STOMP]', str);
        }
      },
    });

    sharedClient.onConnect = (frame) => {
      console.log("✅ [STOMP] Connected successfully!");
      isActivating = false;
      reconnectAttempts = 0;
      ensureSubscriptions();
      onConnect?.(frame);
    };

    sharedClient.onStompError = (frame) => {
      console.error("🔴 [STOMP] STOMP Error:", frame);
      onStompError?.(frame);
    };

    sharedClient.onWebSocketClose = (event) => {
      console.log(`🔴 [STOMP] WebSocket closed: code=${event.code}, reason=${event.reason || 'no reason'}`);
      
      subscriptions.forEach((entry, key) => {
        entry.stompSubscription = null;
      });
      
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        console.log(`🔄 [STOMP] Reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);
        
        setTimeout(() => {
          if (sharedClient && !sharedClient.connected && !isActivating) {
            isActivating = true;
            sharedClient.activate();
          }
        }, delay);
      } else {
        console.error("🔴 [STOMP] Max reconnect attempts reached. Please refresh the page.");
      }
    };

    sharedClient.onWebSocketError = (event) => {
      console.error("🔴 [STOMP] WebSocket error:", event);
    };

    console.log("🔵 [STOMP] Activating client...");
    sharedClient.activate();
  } else {
    console.log("🔵 [STOMP] Reusing existing STOMP client, connected:", sharedClient.connected);
  }

  console.log(`🔵 [STOMP] Adding ${subscribeTopics.length} subscriptions`);
  subscribeTopics.forEach(({ destination, callback, userSpecific = false }) => {
    let finalDestination = destination;
    
    if (userSpecific && userId) {
      finalDestination = destination.replace("{userId}", userId);
    }
    
    const key = subscriptionKey(finalDestination, userId);

    if (!subscriptions.has(key)) {
      console.log(`🔵 [STOMP] Registering subscription: ${finalDestination}`);
      subscriptions.set(key, {
        destination: finalDestination,
        callback,
        stompSubscription: null,
      });
    }
  });

  if (sharedClient.connected) {
    ensureSubscriptions();
  }

  return sharedClient;
}

export function getSharedChatClient() {
  return sharedClient;
}

export async function disconnectSharedChatClient() {
  if (isDisconnecting) {
    console.log("🔵 [STOMP] Already disconnecting, skipping...");
    return;
  }
  
  console.log("🔵 [STOMP] Disconnecting shared client");
  isDisconnecting = true;
  
  isActivating = false;
  reconnectAttempts = 0;
  
  if (sharedClient) {
    subscriptions.forEach((entry, key) => {
      if (entry.stompSubscription) {
        try {
          entry.stompSubscription.unsubscribe();
        } catch (e) {
          console.log(`Error unsubscribing ${key}:`, e);
        }
        entry.stompSubscription = null;
      }
    });
    
    subscriptions.clear();
    
    try {
      await sharedClient.deactivate();
    } catch (e) {
      console.log("Error deactivating client:", e);
    }
    
    sharedClient = null;
    console.log("✅ [STOMP] Disconnected");
  }
  
  isDisconnecting = false;
}