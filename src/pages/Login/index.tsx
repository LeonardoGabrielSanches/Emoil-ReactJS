import React, { useCallback, useState } from 'react';

import * as Yup from 'yup';

import './styles.css';

import { Link, useHistory } from 'react-router-dom';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const history = useHistory();

  const handleSubmit = useCallback(async () => {
    try {
      const schema = Yup.object().shape({
        username: Yup.string().required('O nome de usuário é obrigatório'),
        password: Yup.string().required('A senha é obrigatória'),
      });

      const user = {
        username,
        password,
      };

      await schema.validate(user);

      await signIn({ username, password });

      history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const yupErrors = err.errors.map(error => error);

        addToast({
          title: 'Erro',
          description: yupErrors.join('\r\n'),
        });

        return;
      }

      addToast({
        title: 'Erro na autenticação',
        description: 'Ocorreu um erro ao fazer login, cheque as credenciais',
      });
    }
  }, [addToast, history, password, signIn, username]);

  return (
    <div id="page-login">
      <div className="container">
        <strong className="strong-text">Realizar login</strong>
        <Input
          onChange={e => setUsername(e.target.value)}
          name="user"
          label="Usuário"
          value={username}
        />
        <Input
          onChange={e => setPassword(e.target.value)}
          name="password"
          label="Senha"
          type="password"
          value={password}
        />
        <button onClick={handleSubmit} type="button">
          Logar
        </button>
        <div className="footer">
          <Link to="/signup">Criar novo usuário</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
