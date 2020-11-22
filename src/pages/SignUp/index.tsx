import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import FormContainer from '../../components/FormContainer';
import Input from '../../components/Input';
import PageHeader from '../../components/PageHeader';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import './styles.css';

const SignUp: React.FC = () => {
  const { addToast } = useToast();

  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleButtonPress = useCallback(async () => {
    try {
      const schema = Yup.object().shape({
        username: Yup.string().required('O nome de usuário é obrigatório'),
        password: Yup.string()
          .required('A senha é obrigatória')
          .min(8, 'A senha deve possuir pelo menos oito digitos'),
      });

      const newUser = {
        username,
        password,
      };

      await schema.validate(newUser);

      await api
        .post('/users', newUser)
        .then(() => history.push('/'))
        .catch(error =>
          addToast({ title: 'Erro', description: error.response.data.message }),
        );
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
        description: 'Ocorreu um erro cadastrar um novo usuário',
      });
    }
  }, [addToast, username, password, history]);

  return (
    <div className="container" id="page-registeremployee-form">
      <PageHeader
        signUp
        isMenu={false}
        title="Novo usuário"
        description="Informe todos os campos para o cadastro"
      />
      <FormContainer handleButtonPress={handleButtonPress}>
        <fieldset>
          <legend>Dados do novo usuário</legend>
          <Input
            onChange={e => setUsername(e.target.value)}
            value={username}
            type="text"
            name="username"
            label="Nome de usuário"
          />
          <Input
            onChange={e => setPassword(e.target.value)}
            value={password}
            type="password"
            name="password"
            label="Senha"
          />
        </fieldset>
      </FormContainer>
    </div>
  );
};

export default SignUp;
