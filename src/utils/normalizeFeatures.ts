/**
 * Normaliza un array de features que puede venir de la API como:
 * - string[]
 * - {feature: string, value: string}[]
 * - {id: number, name: string, category: string, icon: string}[]
 * - Mezcla de los anteriores
 *
 * Siempre retorna string[]
 */
export function normalizeFeatures(features: unknown): string[] {
  if (!Array.isArray(features)) return [];

  return features
    .map((f: unknown) => {
      if (typeof f === 'string') return f;
      if (typeof f === 'object' && f !== null) {
        const obj = f as Record<string, unknown>;
        // Intentar extraer un string legible de cualquier estructura de objeto
        const candidate = obj.feature ?? obj.name ?? obj.value ?? obj.label ?? obj.title;
        if (typeof candidate === 'string') return candidate;
      }
      return '';
    })
    .filter((f): f is string => typeof f === 'string' && f.trim().length > 0);
}
