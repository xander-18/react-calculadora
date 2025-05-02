import { useState, useEffect } from 'react';
import './App.css';

const DarkModeButton = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const calculator = document.querySelector('.calculator-wrapper');
    if (calculator) {
      calculator.classList.toggle('dark-mode', dark);
    }

    document.body.style.backgroundColor = dark ? '#ffffff' : '#121212';
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)}>
      {dark ? '🌙' : '🌓'}
    </button>
  );
};

function App() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<string>('');
  const [operation, setOperation] = useState<string>('');
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const handleNumberClick = (number: string) => {
    if (waitingForOperand) {
      setDisplayValue(number);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? number : displayValue + number);
    }
  };

  const handleOperationClick = (op: string) => {
    const currentValue = displayValue;
    
    if (previousValue && operation && !waitingForOperand) {
      const result = performOperation();
      setDisplayValue(result);
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }
    
    setOperation(op);
    setWaitingForOperand(true);
  };

  const performOperation = (): string => {
    const prev = parseFloat(previousValue);
    const current = parseFloat(displayValue);
    let result = 0;

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case 'x':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          return 'Error';
        }
        result = prev / current;
        break;
      default:
        return displayValue;
    }

    // Add to history
    const calculation = `${previousValue} ${operation} ${displayValue} = ${result}`;
    setHistory([...history, calculation]);

    return result.toString();
  };

  const handleEquals = () => {
    if (!operation || waitingForOperand) return;

    const result = performOperation();
    setDisplayValue(result);
    setPreviousValue('');
    setOperation('');
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    setDisplayValue('0');
    setPreviousValue('');
    setOperation('');
    setWaitingForOperand(false);
  };

  const toggleHistoryModal = () => {
    setShowHistory(!showHistory);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const useCalculationFromHistory = (calculation: string) => {
    // Extract the result part after the '='
    const result = calculation.split('=')[1].trim();
    setDisplayValue(result);
    setPreviousValue('');
    setOperation('');
    setWaitingForOperand(true);
    setShowHistory(false);
  };

  return (
    <div className="calculator-container">
      <div className="calculator-wrapper">
        <div className="calculator-header">
          <h2>Calculadora - React</h2>
          <DarkModeButton />
        </div>

        <div className="calculator-display">
          <div className="operation-history">
            {previousValue && `${previousValue} ${operation}`}
          </div>
          <div className="current-value">{displayValue}</div>
        </div>

        <div className="calculator-body">
          <div className="calculator-side-panel">
            <div className="panel-section">
              <div className="panel-item" onClick={() => handleOperationClick('+')}><span>+</span></div>
              <div className="panel-item" onClick={() => handleOperationClick('-')}><span>-</span></div>
              <div className="panel-item" onClick={() => handleOperationClick('x')}><span>x</span></div>
              <div className="panel-item" onClick={() => handleOperationClick('/')}><span>/</span></div>
              <div className="panel-item" onClick={() => handleOperationClick('.')}><span>.</span></div>
            </div>
          </div>

          <div className="calculator-keypad">
            <div className="keypad-row">
              <button onClick={() => handleNumberClick('1')}>1</button>
              <button onClick={() => handleNumberClick('2')}>2</button>
              <button onClick={() => handleNumberClick('3')}>3</button>
            </div>
            <div className="keypad-row">
              <button onClick={() => handleNumberClick('4')}>4</button>
              <button onClick={() => handleNumberClick('5')}>5</button>
              <button onClick={() => handleNumberClick('6')}>6</button>
            </div>
            <div className="keypad-row">
              <button onClick={() => handleNumberClick('7')}>7</button>
              <button onClick={() => handleNumberClick('8')}>8</button>
              <button onClick={() => handleNumberClick('9')}>9</button>
            </div>
            <div className="keypad-row">
              <button onClick={() => handleNumberClick('0')}>0</button>
            </div>

            <div>
              <button className="clear-button" onClick={handleClear}>C</button>
            </div>

            <div>
              <button className="igual-button" onClick={handleEquals}>=</button>
            </div>
          </div>
        </div>

        <div className="calculator-footer">
          <div className="history-toggle" onClick={toggleHistoryModal}>
            <span className="history-icon">📜</span>
            <span>Historial</span>
          </div>
        </div>

        {/* Modal de Historial */}
        {showHistory && (
          <div className="history-modal">
            <div className="history-modal-content">
              <div className="history-modal-header">
                <h3>Historial de Operaciones</h3>
                <button className="close-modal" onClick={toggleHistoryModal}>×</button>
              </div>
              <div className="history-modal-body">
                {history.length === 0 ? (
                  <p className="no-history">No hay operaciones en el historial</p>
                ) : (
                  <ul className="history-list">
                    {history.map((calculation, index) => (
                      <li key={index} onClick={() => useCalculationFromHistory(calculation)}>
                        {calculation}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="history-modal-footer">
                <button className="clear-history" onClick={clearHistory}>
                  Limpiar Historial
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
