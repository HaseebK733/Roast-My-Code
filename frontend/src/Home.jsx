import { useState } from "react";
import './App.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Home() {
  const [Code, SetCode] = useState("");
  const [Result, SetResult] = useState(null);
  const [Loading, SetLoading] = useState(false);

  const handleRoast = async () => {
    SetLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: Code }),
      });
      const data = await response.json();
      SetResult(data);
    } catch (error) {
      console.error("Error roasting:", error);
    } finally {
      SetLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (Result && Result.fixed_code) {
      navigator.clipboard.writeText(Result.fixed_code);
      alert("Fixed code copied to clipboard! 📋");
    }
  };

  function handleChange(e) {
    SetCode(e.target.value);
  }

  const formattedFixedCode = Result?.fixed_code?.replaceAll('\\n', '\n');
const formattedOriginalCode = Code?.replaceAll('\\n', '\n');

  return (
    <div className="container">
      <div className="header-section">
        <h1>Roast My Code</h1>
        <p className="subtitle">Upload your trash, get the truth.</p>
      </div>

      <div className="input-wrapper">
  <textarea
    value={Code}
    onChange={handleChange}
    placeholder="Paste your spaghetti code here..."
  />
  <div className="input-footer">
    <div className="footer-left">
      
    </div>
    <div className="footer-right">
      <span>{Code.length} chars</span>
      <button className="send-btn" onClick={handleRoast}>↑</button>
    </div>
  </div>
</div>
      <button className="roast-btn" onClick={handleRoast} disabled={Loading}>
        {Loading ? "Roasting..." : "Roast Me !!!"}
      </button>

      {/* Notice everything AI-related is now inside this conditional block */}
      {Result && (
        <div className="result-display">
          <div className="roast-header">
            <h2>Score: {Result.rating}/10</h2>
            <p className="roast-text">{Result.roast}</p>
          </div>

          <div className="compare-section">
            <div className="code-block">
              <h3>Your Trash</h3>
              <SyntaxHighlighter language="javascript" style={oneDark} customStyle={{ height: '300px' }}  showInlineLineNumbers={true}>
                {Code} {/* Capitalized to match state */}
              </SyntaxHighlighter>
            </div>

            <div className="code-block" style={{ position: 'relative' }}>
  <h3>The Fix</h3>
  <button onClick={copyToClipboard} className="copy-btn">
    Copy
  </button>
  <SyntaxHighlighter language="python" style={oneDark} customStyle={{ padding: '20px' }} showLineNumbers={true}>
    {formattedFixedCode}
  </SyntaxHighlighter>
</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;