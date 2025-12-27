import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Home from './home';
import Leaderboard from './Leaderboard';

function App(){
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Roast</Link>
        <Link to="/Leaderboard"> Hall of Shame </Link>
      </nav>

      <Routes>
        <Route path="/" element = {<Home />} />
        <Route path="/leaderboard" element = {<Leaderboard/>} />
      </Routes>
    </Router>
  );
}

export default App;