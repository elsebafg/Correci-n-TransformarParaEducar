export default function About() {
  return (
    <div className="animate-fade-in">
      <section className="section" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'white', textAlign: 'center', padding: '80px 0' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '16px' }}>Quiénes Somos</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>Conoce nuestra historia, nuestra misión y los valores que nos definen como institución.</p>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Nuestra Misión</h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--color-text-muted)' }}>
                En el Centro Educativo "Educar para Transformar", nos dedicamos a formar integralmente a nuestros estudiantes. 
                Creemos que la educación es la herramienta más poderosa para transformar la sociedad.
              </p>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                Nuestro compromiso es brindar un entorno de aprendizaje seguro, inclusivo y estimulante donde cada alumno 
                pueda descubrir y desarrollar sus talentos únicos.
              </p>
            </div>
            <div style={{ height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <img src="/bibliotecaescolar.png" alt="Biblioteca escolar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
