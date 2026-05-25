
export default function Footer() {
    const añoActual = new Date().getFullYear()
  return (
    <footer>
      <p>Unlimited Software. Todos los derechos reservados {añoActual} &copy;.</p>
    </footer>
  )
}
