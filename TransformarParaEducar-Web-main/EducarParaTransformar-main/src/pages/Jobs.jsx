import { useState } from 'react';

export default function Jobs() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    puesto: 'Docente Nivel Inicial',
    cv_url: '',
    mensaje: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al enviar');
      return res.json();
    })
    .then(() => {
      setSubmitted(true);
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        puesto: 'Docente Nivel Inicial',
        cv_url: '',
        mensaje: ''
      });
      setLoading(false);
      setTimeout(() => setSubmitted(false), 5000);
    })
    .catch(err => {
      console.error(err);
      alert('Hubo un error al enviar tu postulación. Por favor intenta más tarde.');
      setLoading(false);
    });
  };

  return (
    <div className="animate-fade-in">
      <section className="section bg-light">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card">
            <div className="card-body" style={{ padding: '48px' }}>
              <h1 className="section-title" style={{ marginTop: 0 }}>Trabaja con Nosotros</h1>
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
                Buscamos profesionales apasionados por la educación. Sumate a nuestro equipo.
              </p>
              
              {submitted && (
                <div style={{ backgroundColor: '#D1FAE5', color: 'var(--color-accent-green)', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                  ¡Tu postulación ha sido enviada exitosamente! Nos contactaremos pronto.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Nombre</label>
                    <input required type="text" className="form-input" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Apellido</label>
                    <input required type="text" className="form-input" value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email</label>
                    <input required type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Teléfono</label>
                    <input required type="tel" className="form-input" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Puesto al que aplica</label>
                  <select className="form-select" value={formData.puesto} onChange={e => setFormData({...formData, puesto: e.target.value})}>
                    <option value="Docente Nivel Inicial">Docente Nivel Inicial</option>
                    <option value="Docente Nivel Primario">Docente Nivel Primario</option>
                    <option value="Profesor Secundaria">Profesor Secundaria</option>
                    <option value="Personal Administrativo">Personal Administrativo</option>
                    <option value="Personal de Mantenimiento">Personal de Mantenimiento</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">URL de tu CV (LinkedIn, Drive, etc)</label>
                  <input required type="url" className="form-input" placeholder="https://" value={formData.cv_url} onChange={e => setFormData({...formData, cv_url: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label">Mensaje o Carta de Presentación (Opcional)</label>
                  <textarea className="form-textarea" rows="4" value={formData.mensaje} onChange={e => setFormData({...formData, mensaje: e.target.value})}></textarea>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Enviando...' : 'Enviar Postulación'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
