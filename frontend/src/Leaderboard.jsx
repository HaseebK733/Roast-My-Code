import { useState, useEffect } from "react";
import './App.css';
import { Trophy, Trash2, Calendar, Hash } from 'lucide-react';
// Added these missing imports:
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Leaderboard() {
    const [roasts, setRoasts] = useState([]);
    const [openId, setOpenId] = useState(null);

    const toggleCode = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const fetchLeaderboard = async () => {
        const response = await fetch("https://roast-my-code-python-server.onrender.com/");
        const data = await response.json();
        setRoasts(data);
    };

    const getRatingColour = (rating) => {
        if (rating <= 3) return "#ff4757";
        if (rating <= 7) return "#ffa502";
        return "#2ed573";
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    return (
        <div className="container">
            <div className="header-section">
                <h1>Hall of Shame</h1>
                <p className="subtitle">The most legendary failures in the database.</p>
            </div>

            <div className="leaderboard-list">
                {roasts.map((item, index) => (
                    <div key={item.id} className="leaderboard-card">
                        <div className="card-top">
                            <div className="rank-group">
                                {index === 0 ? (
                                    <Trophy size={20} color="#ffa502" />
                                ) : (
                                    <Hash size={20} color="#8b949e" />
                                )}
                                <span className="rank">{index + 1}</span>
                            </div>

                            <span
                                className="rating-badge"
                                style={{
                                    color: getRatingColour(item.rating),
                                    backgroundColor: `${getRatingColour(item.rating)}22`
                                }}
                            >
                                {item.rating}/10
                            </span>
                        </div>

                        <p className="roast-content">"{item.roast_text}"</p>

                        
                        <button className="view-code-btn" onClick={() => toggleCode(item.id)}>
                            {openId === item.id ? "Hide Code" : "View the Evidence"}
                        </button>

                        {openId === item.id && (
                            <div className="evidence-box">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={oneDark}
                                    customStyle={{ maxHeight: '200px', fontSize: '0.8rem', borderRadius: '8px' }}
                                >
                                    {/* Ensure backend sends 'code_input' */}
                                    {item.code_snippet || "// No code was provided"}
                                </SyntaxHighlighter>
                            </div>
                        )}

                        <div className="card-footer">
                            <div className="footer-meta">
                                <Calendar size={14} />
                                <span className="timestamp">{new Date(item.timestamp).toLocaleDateString()}</span>
                            </div>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Leaderboard;