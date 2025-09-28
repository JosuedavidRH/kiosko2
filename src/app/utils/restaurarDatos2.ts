// src/app/utils/restaurarDatos2.ts

export interface DatosRestaurados {
  codigos: string[];
}

export async function restaurarDatos2(numeroApto: string): Promise<DatosRestaurados> {
  try {
    const response = await fetch(`https://backend-1uwd.onrender.com/api/guardar/recuperar/${numeroApto}`);
    const data = await response.json();

    if (data.success) {
      return { codigos: data.data.map((reg: any) => reg.codigo_qr) };
    }

    return { codigos: [] };
  } catch (err) {
    console.error("Error restaurando datos:", err);
    return { codigos: [] };
  }
}
