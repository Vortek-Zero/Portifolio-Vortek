export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="footer-status">
          <span className="footer-dot" />
          <span>SYSTEM_READY &mdash; &copy; {year} Vortek</span>
        </div>

      </div>
      
      <div className="footer-links">
        <a href="https://github.com/Vortek-Zero" target="_blank" rel="noopener noreferrer">
          [github]
        </a>
        <a
          href="https://www.99freelas.com.br/user/Vortek.Zero"
          target="_blank"
          rel="noopener noreferrer"
        >
          [99freelas]
        </a>
        <a href="https://instagram.com/vortek.zero" target="_blank" rel="noopener noreferrer">
          [instagram]
        </a>
      </div>
    </footer>
  );
}

