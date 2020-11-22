import React, { useState, useCallback, useEffect } from 'react';
import * as Yup from 'yup';

import './styles.css';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import FormContainer from '../../components/FormContainer';
import Select from '../../components/Select';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ISelectOptions {
  id: string;
  name: string;
}

const OilChangeRegister: React.FC = () => {
  const { addToast } = useToast();

  const history = useHistory();

  const [customers, setCustomers] = useState<ISelectOptions[]>([]);
  const [oils, setOils] = useState<ISelectOptions[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedOil, setSelectedOil] = useState('');

  useEffect(() => {
    api.get('/customers').then(response => setCustomers(response.data));
    api.get('/oils').then(response => setOils(response.data));
  }, []);

  const handleButtonPress = useCallback(async () => {
    try {
      const schema = Yup.object().shape({
        customer_id: Yup.string().required('O consumidor é obrigatório.'),
        oil_id: Yup.string().required('O óleo é obrigatório.'),
      });

      const newOilChange = {
        customer_id: selectedCustomer,
        oil_id: selectedOil,
      };

      await schema.validate(newOilChange, { abortEarly: false });

      await api.post('/change', newOilChange);

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
        description: 'Ocorreu um erro ao cadastrar a troca de óleo',
      });
    }
  }, [addToast, history, selectedCustomer, selectedOil]);

  return (
    <div className="container" id="page-registeroilchange-form">
      <PageHeader
        isMenu={false}
        title="Cadastre a troca do óleo"
        description="Informe todos os campos para o cadastro da troca do óleo"
      />
      <FormContainer handleButtonPress={handleButtonPress}>
        <fieldset>
          <Select
            name="customer"
            label="Cliente"
            options={[
              { value: '-1', label: '' },
              ...customers.map(customer => {
                return {
                  value: customer.id,
                  label: customer.name,
                };
              }),
            ]}
            onChange={e => setSelectedCustomer(e.target.value)}
          />
          <Select
            name="oil"
            label="Óleo"
            options={[
              { value: '-1', label: '' },
              ...oils.map(oil => {
                return {
                  value: oil.id,
                  label: oil.name,
                };
              }),
            ]}
            onChange={e => setSelectedOil(e.target.value)}
          />
        </fieldset>
      </FormContainer>
    </div>
  );
};

export default OilChangeRegister;
