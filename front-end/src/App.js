import Header from './components/Header'
import {Typography} from '@mui/material'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import EthAddressValidation from './EthAddressValidation'

function App() {
  return (
    <div className="container">
      <Header />
      <EthAddressValidation />

    </div>
  );
}

export default App;
