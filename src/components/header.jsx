export default function Header() {
    return (
      <header className="site-header">
        <a className="brand" href="#main" aria-label="Northfield University home">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span className="brand-copy">
            <strong>Northfield</strong>
            <span>University · Registrar</span>
          </span>
        </a>
  
        <nav className="top-nav" aria-label="Main navigation">
          <a className="nav-link nav-link-active" href="#directory">
            Student records
          </a>
        </nav>
  
        <div className="profile-indicator" aria-label="Registrar profile">
          <span className="profile-dot" aria-hidden="true" />
          <span>Registrar office</span>
        </div>
      </header>
    );
  }