/* eslint-disable react/no-unescaped-entities */
import Link from "next/link"

export default function notFound() {
  return (
    <div>
      <h2>404 Not Found</h2>
      <p>Page non trouvée</p>
      <Link href="/">Retour à l'accueil</Link>
    </div>
  )
}
