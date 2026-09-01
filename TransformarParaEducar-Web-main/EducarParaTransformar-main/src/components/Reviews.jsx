import { useState, useEffect } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  const [newReview, setNewReview] = useState({ author: '', text: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.author && newReview.text) {
      const reviewData = { author: newReview.author, text: newReview.text, date: 'Justo ahora' };
      fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })
      .then(res => res.json())
      .then(savedReview => {
        setReviews([savedReview, ...reviews]);
        setNewReview({ author: '', text: '' });
      });
    }
  };

  const handleDelete = (id) => {
    fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      .then(() => {
        setReviews(reviews.filter(review => review.id !== id));
      });
  };

  return (
    <section className="section bg-light">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <MessageSquare size={48} color="var(--color-primary)" style={{ marginBottom: '16px' }} />
          <h2 className="section-title" style={{ marginBottom: 0 }}>Opiniones de nuestra Comunidad</h2>
        </div>

        <div className="grid-2">
          {/* Listado de Opiniones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map(review => (
              <div key={review.id} className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ fontWeight: 'bold' }}>{review.author}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{review.date}</span>
                      {user && user.role === 'autoridad' && (
                        <button onClick={() => handleDelete(review.id)} style={{ background: 'none', border: 'none', color: 'var(--color-accent-red)', cursor: 'pointer' }} title="Eliminar opinión">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)' }}>"{review.text}"</p>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario de Opinión */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ marginBottom: '24px' }}>Dejanos tu comentario</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nombre o Alias</label>
                  <input 
                    required 
                    type="text" 
                    className="form-input" 
                    value={newReview.author}
                    onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Comentario</label>
                  <textarea 
                    required 
                    className="form-textarea" 
                    rows="4"
                    value={newReview.text}
                    onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Publicar Opinión
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
