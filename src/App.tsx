import { useState } from 'react';
import './App.css';

function App() {
  const [displayValue, setDisplayValue] = useState<string>('0');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleNumberClick = (number: string) => {
    if (displayValue === '0') {
      setDisplayValue(number);
    } else {
      setDisplayValue(displayValue + number);
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator-wrapper">
        <div className="calculator-header">
          <h2>Calculadora - React</h2>
          <div className="theme-toggle">
            <div className="toggle-circle"></div>
          </div>
        </div>
        
        <div className="calculator-display">
          <div className="operation-history"></div>
          <div className="current-value">{displayValue}</div>
        </div>
        
        <div className="calculator-body">
          <div className="calculator-side-panel">
            <div className="panel-section">
              <div className="panel-item">
                <span>+</span>
              </div>
              <div className="panel-item">
                <span>-</span>
              </div>
              <div className="panel-item">
                <span>x</span>
              </div>
              <div className="panel-item">
                <span>/</span>
              </div>
            </div>
          </div>
          
          <div className="calculator-keypad">
            <div className="keypad-row">
            </div>
          </div>
        </div>
        
        <div className="calculator-footer">
          <div className="history-toggle">
            <span className="history-icon">📜</span>
            <span>Historial</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;