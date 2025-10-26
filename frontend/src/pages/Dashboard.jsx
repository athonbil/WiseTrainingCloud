import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { api } from '../services/api';
import './Dashboard.css';

function Dashboard({ companyId, onLogout }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetails();
  }, [companyId]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getCompanyDetails(companyId);
      setDetails(data);
    } catch (error) {
      console.error('Error loading details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header onLogout={onLogout} />
        <div className="container">
          <div className="loading">Carregando...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onLogout={onLogout} />
      <div className="container">
        <div className="dashboard">
          <h2 className="page-title">Dashboard</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{details?.totalCourses || 0}</div>
              <div className="stat-label">Cursos Cadastrados</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">Grupos Ativos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">Funcionários</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0</div>
              <div className="stat-label">Matrículas</div>
            </div>
          </div>

          <div className="section">
            <h3>Empresa</h3>
            <div className="info-box">
              <p><strong>Nome:</strong> {details?.company?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {details?.company?.email || 'N/A'}</p>
            </div>
          </div>

          <div className="section">
            <h3>Cursos Recentes</h3>
            {details?.courses && details.courses.length > 0 ? (
              <div className="courses-list">
                {details.courses.slice(0, 5).map(course => (
                  <div key={course.id} className="course-item">
                    <div>
                      <h4>{course.title}</h4>
                      <p>{course.description}</p>
                    </div>
                    <span className="course-duration">{course.duration_hours}h</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">Nenhum curso cadastrado ainda.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
