//import './App.scss';
import Navbar from "./Navbar"
const title = "Racing Team Italia: asta piloti 2021-2022";

function App() {
  return (
    <div className="app">
      <Navbar/>
      <div className="container">
        <h1>{ title }</h1>
      </div>
    </div>
  );
}

export default App;
