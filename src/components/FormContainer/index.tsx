import React from 'react';

import WarningIcon from '../../assets/warning.png';

import './styles.css';

interface IFormContainerProps{
  handleButtonPress():void;
}

const FormContainer: React.FC<IFormContainerProps> = props => {
  return (
    <main className="main-container">
      {props.children}
      <footer>
        <p>
          <img src={WarningIcon} width="35" alt="Aviso Importante" />
          Importante
          <br />
          Preencha todos os dados
        </p>
        <button onClick={props.handleButtonPress} type="button">Salvar cadastro</button>
      </footer>
    </main>
  );
};

export default FormContainer;
