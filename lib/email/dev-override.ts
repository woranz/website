export const DEV_EMAIL = "digital@woranz.com"

export function isNonProductionEnv(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview"
  )
}
