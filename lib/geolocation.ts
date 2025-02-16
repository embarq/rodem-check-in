'use client'

import { useRef, useState } from 'react'
import mitt from 'mitt'

export interface UseGeolocationResult {
  latitude: number
  longitude: number
}

export type UseGeolocationEvents = {
  loading?: boolean
  error?: Error
  result?: UseGeolocationResult
}

export const useGeolocation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [coords, setCoords] = useState<UseGeolocationResult | null>(null)
  const events = useRef(mitt<UseGeolocationEvents>())

  const requestLocation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!('geolocation' in navigator)) {
        return events.current.emit(
          'error',
          new Error('message_error_geolocation_not_supported'),
        )
      }

      const permission = await navigator.permissions.query({
        name: 'geolocation',
      })

      if (permission.state === 'denied') {
        return events.current.emit(
          'error',
          new Error('message_error_location_permission_denied'),
        )
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          })
        },
      )

      const newCoords: UseGeolocationResult = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }

      setCoords(newCoords)

      return newCoords
    } catch (error) {
      const e =
        error instanceof Error ? error : new Error('message_error_unknown')
      setError(e)
      events.current.emit('error', e)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    requestLocation,
    isLoading,
    error,
    coords,
    events: events.current,
  }
}

