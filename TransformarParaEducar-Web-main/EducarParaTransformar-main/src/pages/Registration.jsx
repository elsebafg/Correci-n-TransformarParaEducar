import { useState } from 'react';

export default function Registration() {
  const [formData, setFormData] = useState({
    nombreAspirante: '',
    apellidoAspirante: '',
    dniAspirante: '',
    nivel: 'inicial',
    nombreTutor: '',
    apellidoTutor: '',
    dniTutor: '',
    email: '',
    telefono: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // USAMOS EL MISMO PUERTO QUE EN JOBS (3001)
    fetch('/api/inscripciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al enviar la inscripción');
      return res.json();
    })
    .then(() => {
      setSubmitted(true);
      // Limpiamos el formulario
      setFormData({
        nombreAspirante: '',
        apellidoAspirante: '',
        dniAspirante: '',
        nivel: 'inicial',
        nombreTutor: '',
        apellidoTutor: '',
        dniTutor: '',
        email: '',
        telefono: ''
      });
      setLoading(false);
      // Opcional: quitar el mensaje de éxito después de unos segundos
      setTimeout(() => setSubmitted(false), 5000);
    })
    .catch(err => {
      console.error(err);
      alert('Hubo un error al enviar la inscripción. Por favor intenta más tarde.');
      setLoading(false);
    });
  };
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="animate-fade-in">
      <section className="section bg-light">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card">
            <div className="card-body" style={{ padding: '48px' }}>
              <h1 className="section-title" style={{ marginTop: 0 }}>Solicitud de Inscripción</h1>
              
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ display: 'inline-block', padding: '16px', backgroundColor: '#D1FAE5', borderRadius: '50%', marginBottom: '24px' }}>
                     <span style={{ fontSize: '32px' }}>✓</span>
                  </div>
                  <h2 style={{ marginBottom: '16px' }}>¡Solicitud Enviada!</h2>
                  <p style={{ color: 'var(--color-text-muted)' }}>Nos pondremos en contacto contigo a la brevedad para continuar el proceso.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>Datos del Aspirante</h3>
                  <div className="grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Nombre</label>
                      <input required type="text" name="nombreAspirante" className="form-input" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras y espacios" onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Apellido</label>
                      <input required type="text" name="apellidoAspirante" className="form-input" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras y espacios" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">DNI del Aspirante</label>
                    <input required type="text" name="dniAspirante" className="form-input" pattern="[0-9]{7,8}" title="Ingrese entre 7 y 8 dígitos numéricos" onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nivel Educativo al que aplica</label>
                    <select name="nivel" className="form-select" onChange={handleChange}>
                      <option value="inicial">Nivel Inicial</option>
                      <option value="primario">Nivel Primario</option>
                      <option value="secundario">Nivel Secundario</option>
                    </select>
                  </div>

                  <h3 style={{ marginBottom: '24px', marginTop: '32px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>Datos del Tutor</h3>
                  <div className="grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Nombre</label>
                      <input required type="text" name="nombreTutor" className="form-input" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras y espacios" onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Apellido</label>
                      <input required type="text" name="apellidoTutor" className="form-input" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras y espacios" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">DNI del Tutor</label>
                    <input required type="text" name="dniTutor" className="form-input" pattern="[0-9]{7,8}" title="Ingrese entre 7 y 8 dígitos numéricos" onChange={handleChange} />
                  </div>
                  <div className="grid-2" style={{ gap: '16px', marginBottom: '32px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Email de Contacto</label>
                      <input required type="email" name="email" className="form-input" onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Teléfono</label>
                      <input required type="tel" name="telefono" className="form-input" pattern="[0-9]+" title="Solo se permiten números" onChange={handleChange} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-accent" style={{ width: '100%', fontSize: '1.1rem' }}>
                    Enviar Solicitud
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
