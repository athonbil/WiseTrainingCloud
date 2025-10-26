import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { api } from '../services/api';
import './Courses.css';

function Courses({ companyId, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_hours: 0,
    is_public: false,
    price: 0
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await api.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createCourse({
        ...formData,
        owner_company_id: companyId
      });
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        duration_hours: 0,
        is_public: false,
        price: 0
      });
      loadCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Erro ao criar curso');
    }
  };

  return (
    <>
      <Header onLogout={onLogout} />
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">Cursos</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancelar' : 'Novo Curso'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h3>Criar Novo Curso</h3>
            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duração (horas)</label>
                  <input
                    type="number"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData({...formData, duration_hours: parseInt(e.target.value)})}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Preço</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                  />
                  <span>Curso Público</span>
                </label>
              </div>

              <button type="submit" className="btn-submit">Criar Curso</button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Carregando cursos...</div>
        ) : (
          <div className="courses-grid">
            {courses.length > 0 ? (
              courses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <h3>{course.title}</h3>
                    {course.is_public && <span className="badge-public">Público</span>}
                  </div>
                  <p className="course-description">{course.description}</p>
                  <div className="course-footer">
                    <span className="course-info">{course.duration_hours}h</span>
                    {course.price > 0 && (
                      <span className="course-price">R$ {course.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">Nenhum curso encontrado.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Courses;
