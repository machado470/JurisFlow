import { BrowserRouter } from 'react-router-dom'
import Router from './router'

export default function App() {
  return (
    <div
      style={{
        background: 'black',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  )
}
