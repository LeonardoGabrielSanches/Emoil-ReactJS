import React from 'react';
import { Link } from 'react-router-dom';

import { AiOutlinePoweroff } from 'react-icons/ai';
import backIcon from '../../assets/back.svg';
import { useAuth } from '../../hooks/auth';

import './styles.css';

interface PageHeaderProps {
  title: string;
  description?: string;
  isMenu: boolean;
  signUp?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = props => {
  const { signOut } = useAuth();

  return (
    <header className="page-header">
      <div className="top-bar-container">
        {!props.isMenu && (
          <Link to="/">
            <img src={backIcon} alt="Voltar" />
          </Link>
        )}
        {!props.signUp && <AiOutlinePoweroff size={24} onClick={signOut} />}
      </div>

      <div className="header-content">
        <strong>{props.title}</strong>
        {props.description && <p>{props.description}</p>}
        {props.children}
      </div>
    </header>
  );
};

export default PageHeader;
