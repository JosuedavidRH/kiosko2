// src/app/utils/cerrarSesion.ts

export interface CerrarSesionPayload {
  auto?: boolean;
  temporizadorPrincipal?: number;
  statusActual?: number;
  userId?: string;
  temporizadorFactura1?: number;
  temporizadorFactura2?: number;
  temporizadorFactura3?: number;
}

export function cerrarSesionGlobal({
  auto = false,
  temporizadorPrincipal,
  statusActual,
  userId: userIdParam,
  temporizadorFactura1,
  temporizadorFactura2,
  temporizadorFactura3,
}: CerrarSesionPayload = {}): void {
  const userId = userIdParam || localStorage.getItem("apartmentNumber");
  if (!userId) {
    console.warn("⚠️ cerrarSesionGlobal: No se encontró userId");
    return;
  }

  // Principal
  const temp =
    temporizadorPrincipal !== undefined
      ? temporizadorPrincipal
      : Number.parseInt(localStorage.getItem("timeLeftPrincipal") || "0", 10) ||
        0;

  // Status
  const status =
    statusActual !== undefined
      ? statusActual
      : Number(localStorage.getItem("clickCount") || "0") || 0;

  // Factura1
  const tempFactura1 =
    temporizadorFactura1 !== undefined
      ? temporizadorFactura1
      : Number(localStorage.getItem("timeLeftFactura1") || "0") || 0;

  // Factura2
  const tempFactura2 =
    temporizadorFactura2 !== undefined
      ? temporizadorFactura2
      : Number(localStorage.getItem("timeLeftFactura2") || "0") || 0;

  // Factura3
  const tempFactura3 =
    temporizadorFactura3 !== undefined
      ? temporizadorFactura3
      : Number(localStorage.getItem("timeLeftFactura3") || "0") || 0;

  // Payload único
  const body = JSON.stringify({
    userId,
    temporizadorPrincipal: temp,
    statusActual: status,
    temporizadorFactura1: tempFactura1,
    temporizadorFactura2: tempFactura2,
    temporizadorFactura3: tempFactura3,
  });

  try {
    if (auto && navigator.sendBeacon) {
      navigator.sendBeacon(
        "http://localhost:4000/api/realtime/cerrarSesion",
        new Blob([body], { type: "application/json" })
      );

      console.log("📡 Datos enviados con sendBeacon (auto)", {
        temp,
        status,
        tempFactura1,
        tempFactura2,
        tempFactura3,
      });

      localStorage.clear();
      console.log("🧹 LocalStorage limpiado INMEDIATO (auto)");
      return;
    }

    // Manual con fetch
    fetch("http://localhost:4000/api/realtime/cerrarSesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });

    console.log("📡 Datos enviados con fetch (manual)", {
      temp,
      status,
      tempFactura1,
      tempFactura2,
      tempFactura3,
    });
  } catch (e) {
    console.error("❌ Error cerrando sesión:", e);
  } finally {
    if (!auto) {
      localStorage.clear();
      console.log("🧹 LocalStorage limpiado (manual)");
    }
  }
}
