export default function Levels() {
  return (
    <div className="animate-fade-in">
      <section className="section" style={{ backgroundColor: 'var(--color-primary)', color: 'white', textAlign: 'center', padding: '80px 0' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '16px' }}>Niveles Educativos</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>Una propuesta pedagógica integral desde los primeros pasos hasta el egreso.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            <div className="card">
              <div className="card-body">
                <span className="badge badge-pink" style={{ marginBottom: '16px' }}>Nivel Inicial</span>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Jardín de Infantes</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  Estimulación temprana, juego y socialización en un ambiente cálido y seguro.
                </p>
                <ul style={{ paddingLeft: '20px', color: 'var(--color-text-muted)' }}>
                  <li>Salas de 3, 4 y 5 años</li>
                  <li>Iniciación al inglés</li>
                  <li>Educación física y música</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <span className="badge badge-green" style={{ marginBottom: '16px' }}>Nivel Primario</span>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Primaria</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  Formación académica sólida con jornada extendida opcional para potenciar habilidades.
                </p>
                <ul style={{ paddingLeft: '20px', color: 'var(--color-text-muted)' }}>
                  <li>Jornada simple y extendida</li>
                  <li>Inglés intensivo</li>
                  <li>Taller de robótica y arte</li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <span className="badge badge-orange" style={{ marginBottom: '16px' }}>Nivel Secundario</span>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Secundaria</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  Preparación de excelencia para la universidad y los desafíos del mundo moderno.
                </p>
                <ul style={{ paddingLeft: '20px', color: 'var(--color-text-muted)' }}>
                  <li>Doble titulación (opcional)</li>
                  <li>Orientaciones especializadas</li>
                  <li>Prácticas profesionalizantes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
