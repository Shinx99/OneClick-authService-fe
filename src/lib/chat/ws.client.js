"use client";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getAccessToken } from "@/lib/apiClient/api.config";

let sharedClient = null;
const subscriptions = new Map();

const socketUrl = `${process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080"}/ws`;

function subscriptionKey(destination, userId = null) {
  return userId ? `${destination}:${userId}` : destination;
}

export function createChatStompClient({
  accessToken,
  onConnect,
  onStompError,
  subscribeTopics = [],
  userId = null,
} = {}) {
  if (typeof window === "undefined") return null;

  const token = accessToken || getAccessToken();
  console.log("🔵 [STOMP] Creating client, token present:", !!token);
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("🔵 [STOMP] Token roles:", payload.roles);
      console.log("🔵 [STOMP] Token sub:", payload.sub);
    } catch (e) {
      console.log("🔵 [STOMP] Token decode failed:", e.message);
    }
  }
  
  const connectHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  console.log("🔵 [STOMP] Connect headers:", Object.keys(connectHeaders));
  console.log("🔵 [STOMP] Socket URL:", socketUrl);

  if (!sharedClient) {
    console.log("🔵 [STOMP] Creating new STOMP client instance");
    
    sharedClient = new Client({
      webSocketFactory: () => {
        console.log("🔵 [STOMP] Creating SockJS connection to:", socketUrl);
        const sock = new SockJS(socketUrl);
        
        // Log SockJS events
        sock.onopen = () => console.log("🔵 [STOMP] SockJS onopen");
        sock.onclose = (e) => console.log("🔴 [STOMP] SockJS onclose:", e.code, e.reason);
        sock.onerror = (e) => console.error("🔴 [STOMP] SockJS onerror:", e);
        
        return sock;
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectionTimeout: 30000,
      connectHeaders: connectHeaders,
      debug: (str) => {
        // Log STOMP protocol messages
        if (str.includes("CONNECT") || str.includes("CONNECTED")) {
          console.log("🔵 [STOMP] Protocol:", str);
        } else if (str.includes("ERROR")) {
          console.error("🔴 [STOMP] Protocol error:", str);
        } else {
          console.log("[STOMP]", str);
        }
      },
    });

    sharedClient.onConnect = (frame) => {
      console.log("✅ [STOMP] Connected successfully!");
      console.log("✅ [STOMP] Frame headers:", frame.headers);
      ensureSubscriptions();
      onConnect?.(frame);
    };

    sharedClient.onStompError = (frame) => {
      console.error("🔴 [STOMP] STOMP Error:", frame);
      console.error("🔴 [STOMP] Error headers:", frame.headers);
      console.error("🔴 [STOMP] Error body:", frame.body);
      onStompError?.(frame);
    };

    sharedClient.onWebSocketClose = (event) => {
      console.log(`🔴 [STOMP] WebSocket closed: code=${event.code}, reason=${event.reason || 'no reason'}`);
      subscriptions.forEach((entry, key) => {
        console.log(`   - Unsubscribing: ${key}`);
        entry.stompSubscription = null;
      });
    };

    sharedClient.onWebSocketError = (event) => {
      console.error("🔴 [STOMP] WebSocket error:", event);
    };

    console.log("🔵 [STOMP] Activating client...");
    sharedClient.activate();
  } else {
    console.log("🔵 [STOMP] Reusing existing STOMP client, connected:", sharedClient.connected);
  }

  // Add subscriptions
  console.log(`🔵 [STOMP] Adding ${subscribeTopics.length} subscriptions`);
  subscribeTopics.forEach(({ destination, callback, userSpecific = false }) => {
    let finalDestination = destination;
    
    if (userSpecific && userId) {
      finalDestination = destination.replace("{userId}", userId);
      console.log(`🔵 [STOMP] User-specific destination: ${finalDestination}`);
    }
    
    const key = subscriptionKey(finalDestination, userId);

    if (!subscriptions.has(key)) {
      console.log(`🔵 [STOMP] Registering subscription: ${finalDestination}`);
      subscriptions.set(key, {
        destination: finalDestination,
        callback,
        stompSubscription: null,
      });
    } else {
      console.log(`🔵 [STOMP] Subscription already exists: ${finalDestination}`);
    }
  });

  if (sharedClient.connected) {
    console.log("🔵 [STOMP] Client already connected, ensuring subscriptions...");
    ensureSubscriptions();
  }

  return sharedClient;
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

export function getSharedChatClient() {
  console.log("🔵 [STOMP] getSharedChatClient called, exists:", !!sharedClient);
  return sharedClient;
}

export async function disconnectSharedChatClient() {
  console.log("🔵 [STOMP] Disconnecting shared client");
  if (sharedClient) {
    subscriptions.forEach((entry, key) => {
      console.log(`   - Unsubscribing: ${key}`);
      entry.stompSubscription?.unsubscribe?.();
      entry.stompSubscription = null;
    });
    subscriptions.clear();
    await sharedClient.deactivate();
    sharedClient = null;
    console.log("✅ [STOMP] Disconnected");
  }
}