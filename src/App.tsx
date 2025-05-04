import { useEffect, useState } from 'react';
import './App.css';

const ThemeToggle = ({ dark, toggleTheme }: { dark: boolean; toggleTheme: () => void }) => (
  <div className="theme-toggle" onClick={toggleTheme}>
    <div className={`toggle-circle ${dark ? 'dark' : ''}`}></div>
    <span className="toggle-icon">{dark ? '🌙' : '☀️'}</span>
  </div>
);

const CalcButton = ({ 
  value, 
  onClick, 
  className = '' 
}: { 
  value: string; 
  onClick: () => void; 
  className?: string 
}) => (
  <button className={`calc-button ${className}`} onClick={onClick}>
    {value}
  </button>
);

function App() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<string>('');
  const [operation, setOperation] = useState<string>('');
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>('calculator');
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    document.body.style.backgroundColor = dark ? '#121212' : '#f5f7fa';
    document.body.classList.toggle('dark-theme', dark);
  }, [dark]);

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
      case '×':
        result = prev * current;
        break;
      case '÷':
        if (current === 0) {
          return 'Error';
        }
        result = prev / current;
        break;
      default:
        return displayValue;
    }

    const formattedResult = Number.isInteger(result) ? 
      result.toString() : 
      parseFloat(result.toFixed(8)).toString();
    
    const calculation = `${previousValue} ${operation} ${displayValue} = ${formattedResult}`;
    setHistory([...history, calculation]);

    return formattedResult;
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

  const handleDecimalPoint = () => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
    } else if (displayValue.indexOf('.') === -1) {
      setDisplayValue(displayValue + '.');
    }
  };

  const toggleHistoryModal = () => {
    setShowHistory(!showHistory);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleCalculationFromHistory = (calculation: string) => {
    const result = calculation.split('=')[1].trim();
    setDisplayValue(result);
    setPreviousValue('');
    setOperation('');
    setWaitingForOperand(true);
    setShowHistory(false);
  };

  const toggleTheme = () => {
    setDark((prev) => !prev);
  };

  const renderCalculator = () => (
    <div className="calculator-container">
      <div className={`calculator-wrapper ${dark ? 'dark-mode' : ''}`}>
        <div className="calculator-header">
          <h2>Calculadora Pro</h2>
          <ThemeToggle dark={dark} toggleTheme={toggleTheme} />
        </div>

        <div className="calculator-display">
          <div className="operation-history">
            {previousValue && `${previousValue} ${operation}`}
          </div>
          <div className="current-value">{displayValue}</div>
        </div>

        <div className="calculator-body">
          <div className="calculator-keypad">
            <CalcButton value="C" onClick={handleClear} className="clear-btn" />
            <CalcButton value="%" onClick={() => {
              const value = parseFloat(displayValue) / 100;
              setDisplayValue(value.toString());
            }} className="function-btn" />
            <CalcButton value="⌫" onClick={() => {
              if (displayValue.length > 1) {
                setDisplayValue(displayValue.slice(0, -1));
              } else {
                setDisplayValue('0');
              }
            }} className="function-btn" />
            <CalcButton value="÷" onClick={() => handleOperationClick('÷')} className="operator-btn" />

            <CalcButton value="7" onClick={() => handleNumberClick('7')} />
            <CalcButton value="8" onClick={() => handleNumberClick('8')} />
            <CalcButton value="9" onClick={() => handleNumberClick('9')} />
            <CalcButton value="×" onClick={() => handleOperationClick('×')} className="operator-btn" />

            <CalcButton value="4" onClick={() => handleNumberClick('4')} />
            <CalcButton value="5" onClick={() => handleNumberClick('5')} />
            <CalcButton value="6" onClick={() => handleNumberClick('6')} />
            <CalcButton value="-" onClick={() => handleOperationClick('-')} className="operator-btn" />

            <CalcButton value="1" onClick={() => handleNumberClick('1')} />
            <CalcButton value="2" onClick={() => handleNumberClick('2')} />
            <CalcButton value="3" onClick={() => handleNumberClick('3')} />
            <CalcButton value="+" onClick={() => handleOperationClick('+')} className="operator-btn" />

            <CalcButton value="0" onClick={() => handleNumberClick('0')} className="zero-btn" />
            <CalcButton value="." onClick={handleDecimalPoint} />
            <CalcButton value="=" onClick={handleEquals} className="equals-btn" />
          </div>
        </div>

        <div className="calculator-footer">
          <div className="history-toggle" onClick={toggleHistoryModal}>
            <span className="history-icon">📜</span>
            <span>Historial</span>
          </div>
        </div>

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
                      <li key={index} onClick={() => handleCalculationFromHistory(calculation)}>
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

  const renderAboutPage = () => (
    <div className="about-page">
      <div className="about-container">
        <h1>Sobre Nuestra Calculadora</h1>
        <div className="about-content">
          <div className="about-image">
            <div className="image-placeholder">
              <span className="calculator-icon">🧮</span>
            </div>
          </div>
          <div className="about-text">
            <h2>Calculadora Pro</h2>
            <p>Nuestra calculadora profesional está diseñada para ofrecer una experiencia de usuario excepcional con una interfaz moderna e intuitiva.</p>
            <p>Desarrollada con las últimas tecnologías web, incluyendo React y TypeScript, esta calculadora combina funcionalidad robusta con un diseño estético y profesional.</p>
            <h3>Características principales:</h3>
            <ul>
              <li>Operaciones matemáticas básicas con precisión</li>
              <li>Historial de cálculos accesible y reutilizable</li>
              <li>Modo oscuro/claro para adaptarse a tus preferencias</li>
              <li>Interfaz adaptable a diferentes dispositivos</li>
              <li>Animaciones y transiciones suaves</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactPage = () => (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contacto</h1>
        <div className="contact-content">
          <div className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input type="text" id="name" placeholder="Tu nombre" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="tucorreo@ejemplo.com" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea id="message" rows={5} placeholder="Escribe tu mensaje aquí..."></textarea>
            </div>
            <button className="submit-button">Enviar Mensaje</button>
          </div>
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📱</div>
              <h3>Llámanos</h3>
              <p>+51 944 541 475</p>
            </div>
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>Escríbenos</h3>
              <p>info@calculadorapro.com</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🏢</div>
              <h3>Visítanos</h3>
              <p>Av. Salaverry 123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">🧮</span>
          <h1>CalculadoraPro</h1>
        </div>
        <nav className="main-nav">
          <ul>
            <li className={activePage === 'calculator' ? 'active' : ''}>
              <button onClick={() => setActivePage('calculator')}>Calculadora</button>
            </li>
            <li className={activePage === 'about' ? 'active' : ''}>
              <button onClick={() => setActivePage('about')}>Sobre Nosotros</button>
            </li>
            <li className={activePage === 'contact' ? 'active' : ''}>
              <button onClick={() => setActivePage('contact')}>Contacto</button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="app-content">
        {activePage === 'calculator' && renderCalculator()}
        {activePage === 'about' && renderAboutPage()}
        {activePage === 'contact' && renderContactPage()}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CalculadoraPro</h3>
            <p>La mejor calculadora para tus necesidades diarias.</p>
          </div>
          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><button onClick={() => setActivePage('calculator')}>Calculadora</button></li>
              <li><button onClick={() => setActivePage('about')}>Sobre Nosotros</button></li>
              <li><button onClick={() => setActivePage('contact')}>Contacto</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Síguenos</h3>
            <div className="social-icons">
              <span className="social-icon">📱</span>
              <span className="social-icon">💻</span>
              <span className="social-icon">📘</span>
              <span className="social-icon">📸</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CalculadoraPro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;