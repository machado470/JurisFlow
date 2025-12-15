import useOrganization from '../../hooks/useOrganization'

export default function Login() {
  const { set } = useOrganization()

  function login() {
    set({ id: 'demo-org', name: 'Demo Org' })
  }

  return (
    <button onClick={login}>
      Entrar
    </button>
  )
}
