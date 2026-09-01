export default function Wellbeing() {
  return (
    <div className="animate-fade-in">
      <section className="section" style={{ backgroundColor: 'var(--color-accent-green)', color: 'white', textAlign: 'center', padding: '80px 0' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '16px' }}>Bienestar Estudiantil</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>Cuidamos el desarrollo físico, mental y emocional de cada alumno.</p>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="grid-2">
            <div className="card">
               <div className="card-body">
                 <h2 style={{ marginBottom: '16px' }}>Deportes y Actividad Física</h2>
                 <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                   Nuestras instalaciones deportivas de primer nivel permiten a los alumnos participar en diversas disciplinas:
                 </p>
                 <ul style={{ paddingLeft: '20px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                   <li>Atletismo y Gimnasia</li>
                   <li>Natación en pileta climatizada</li>
                   <li>Fútbol, Básquet y Vóley</li>
                 </ul>
               </div>
            </div>
            <div className="card">
               <div className="card-body">
                 <h2 style={{ marginBottom: '16px' }}>Apoyo Psicopedagógico</h2>
                 <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                   Contamos con un gabinete interdisciplinario dedicado a acompañar el proceso de aprendizaje y el desarrollo emocional.
                 </p>
               </div>
            </div>
            <div className="card" style={{ gridColumn: '1 / -1' }}>
               <div className="card-body text-center">
                 <h2 style={{ marginBottom: '16px' }}>Idiomas y Visión Global</h2>
                 <p style={{ color: 'var(--color-text-muted)', maxWidth: '800px', margin: '0 auto' }}>
                   El dominio de lenguas extranjeras es fundamental. Ofrecemos Inglés intensivo desde el nivel inicial y opciones de Francés y Portugués en secundaria.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
