export const checkInTargetGeolocation =
  process.env.NEXT_PUBLIC_TARGET_GEOLOCATION

export const checkInTargetMaxDistance = parseInt(
  process.env.NEXT_PUBLIC_TARGET_MAX_DISTANCE ?? '0',
)

export const checkInDebounceMinutes = parseInt(
  process.env.NEXT_PUBLIC_CHECK_IN_DEBOUNCE_MINUTES ?? '0',
)

