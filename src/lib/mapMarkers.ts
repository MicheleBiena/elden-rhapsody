import { currentMapStage } from '../data/project'
import type { MapMarker } from '../types'

export const MAP_MARKERS_STORAGE_KEY = 'elden-rhapsody:map-markers-v2'
export const LEGACY_MAP_MARKERS_STORAGE_KEY = 'elden-rhapsody:map-markers'

// The original 1080 × 760 image is a top-aligned crop of the 1080 × 1509 map.
// Keep this coordinate frame fixed if later episodes publish another image.
const legacyMapStage = { id: 'sepolcride-01', width: 1080, height: 760 }

export function formatMapCoordinates(x: number, y: number) {
  return `X ${x.toFixed(2)}% · Y ${y.toFixed(2)}%`
}

function isMapMarker(value: unknown): value is MapMarker {
  if (!value || typeof value !== 'object') return false
  return ['id', 'title', 'region', 'coordinates', 'note', 'createdAt'].every(
    (key) => typeof (value as Record<string, unknown>)[key] === 'string',
  )
}

export function migrateLegacyMapMarkers(value: unknown): MapMarker[] {
  if (!Array.isArray(value)) return []

  return value.filter(isMapMarker).map((marker) => {
    if (marker.mapStageId && marker.mapStageId !== legacyMapStage.id) return marker

    const hasPoint =
      typeof marker.x === 'number' && Number.isFinite(marker.x) &&
      typeof marker.y === 'number' && Number.isFinite(marker.y) &&
      marker.x >= 0 && marker.x <= 100 && marker.y >= 0 && marker.y <= 100

    if (!hasPoint) {
      // Textual references have no image-relative point to convert.
      return { ...marker, mapStageId: currentMapStage.id, x: undefined, y: undefined }
    }

    const x = marker.x! * legacyMapStage.width / currentMapStage.width
    const y = marker.y! * legacyMapStage.height / currentMapStage.height
    const generatedCoordinates = /^X [\d.]+% · Y [\d.]+%$/.test(marker.coordinates)

    return {
      ...marker,
      mapStageId: currentMapStage.id,
      x,
      y,
      // Retain full precision for placement; round only the displayed reference.
      coordinates: generatedCoordinates ? formatMapCoordinates(x, y) : marker.coordinates,
    }
  })
}

export function loadLegacyMapMarkers(): MapMarker[] {
  // Never overwrite or remove the legacy key: it remains a recovery copy.
  try {
    const saved = window.localStorage.getItem(LEGACY_MAP_MARKERS_STORAGE_KEY)
    return saved ? migrateLegacyMapMarkers(JSON.parse(saved)) : []
  } catch {
    return []
  }
}
