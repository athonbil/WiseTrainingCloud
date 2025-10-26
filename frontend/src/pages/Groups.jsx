import { useState } from 'react';
import Header from '../components/Header';
import './Groups.css';

function Groups({ companyId, onLogout }) {
  const [groups, setGroups] = useState([]);

  return (
    <>
      <Header onLogout={onLogout} />
      <div className="container">
        <div className="page-header">
          <h2 className="page-title">Grupos</h2>
          <button className="btn-primary">Novo Grupo</button>
        </div>

        <div className="groups-grid">
          <p className="empty-state">Nenhum grupo cadastrado ainda.</p>
        </div>
      </div>
    </>
  );
}

export default Groups;
