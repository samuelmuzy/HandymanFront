import './App.css'
import { Router } from './routes';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <div>
      <Router />
      <ToastContainer />
    </div>
  )
}

      export default App
