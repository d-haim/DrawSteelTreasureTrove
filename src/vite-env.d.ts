/// <reference types="vite/client" />

// Vite asset imports with ?url query
declare module '*.json?url' {
  const url: string
  export default url
}
