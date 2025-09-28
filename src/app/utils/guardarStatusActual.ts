
// src/app/utils/guardarStatusActual.ts

/**
 * Guarda el estado actual en localStorage y lo envía al backend
 * @param nuevoEstado - Nuevo valor de statusActual (ej: clickCount)
 * @param aptoParam - Número de apartamento (opcional, si no se usa toma de localStorage)
 */
export async function guardarStatusActual(nuevoEstado: number, aptoParam?: string | null): Promise<void> {
  try {
    const apartmentNumber = aptoParam || localStorage.getItem("apartmentNumber");

    if (!apartmentNumber) {
      console.warn("⚠️ No se encontró apartmentNumber para guardar statusActual");
      return;
    }

    console.log(`📤 Enviando a guardar_statusActual: { userId: '${apartmentNumber}', statusActual: '${nuevoEstado}' }`);

    const res = await fetch("https://backend-1uwd.onrender.com/api/realTime/statusActual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: apartmentNumber,
        statusActual: nuevoEstado
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al guardar statusActual");

    console.log("✅ StatusActual guardado correctamente");
  } catch (error) {
    console.error("❌ Error al guardar statusActual:", error);
  }
}
