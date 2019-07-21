import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { validateAge, validateEmail } from './validate';

const InputForm = styled.input`
  margin: 20px;
`;

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormBuilder = ({ formSchema }) => {
  const formatToCamel = label => label[0].toLowerCase() + label.substring(1).replace(/\s/g, '');

  const stateObj = {};
  formSchema.forEach(({ label }) => {
    stateObj[formatToCamel(label)] = '';
    stateObj[`${formatToCamel(label)}Hidden`] = { visibility: 'visible' };
    stateObj[`${formatToCamel(label)}Error`] = {};
  });
  const [state, setState] = useState(stateObj);
  const [validate, setValidate] = useState(true);
  const [success, setSuccess] = useState(false);

  const getStateVal = value => state[formatToCamel(value)];


  const handleChange = (event, label, type) => {
    const content = event.target.value;
    let cssError = { [formatToCamel(`${label}Error`)]: { color: 'initial' } };
    switch (type) {
      case 'text':
        if (content.length > 20) {
          cssError = { [formatToCamel(`${label}Error`)]: { color: 'red' } };
        }
        break;
      case 'email':
        if (content.length > 10 || !validateEmail(content)) {
          cssError = { [formatToCamel(`${label}Error`)]: { color: 'red' } };
        }
        break;
      case 'number':
        if (parseInt(content, 10) < 18 || parseInt(content, 10) > 60) {
          cssError = { [formatToCamel(`${label}Error`)]: { color: 'red' } };
        }
        break;
      case 'date':
        if (validateAge(content) < 18) {
          cssError = { [formatToCamel(`${label}Error`)]: { color: 'red' } };
        }
        break;
      default:
        break;
    }
    setState({ ...state, ...cssError, [formatToCamel(label)]: content });
  };

  const handleSubmit = (event, formSchemaSubmitted) => {
    // mock API call :)
    event.preventDefault();
    const cssHidden = state;
    let valid = 0;
    formSchemaSubmitted.forEach(({ label, type }) => {
      switch (type) {
        case 'text':
          if (getStateVal(label).length <= 20 && getStateVal(label).length > 0) {
            cssHidden[formatToCamel(`${label}Hidden`)] = { visibility: 'hidden' };
            valid += 1;
          }
          break;
        case 'email':
          if (
            getStateVal(label).length <= 10
            && getStateVal(label).length > 0
            && validateEmail(getStateVal(label))
          ) {
            cssHidden[formatToCamel(`${label}Hidden`)] = { visibility: 'hidden' };
            valid += 1;
          }
          break;
        case 'number':
          if (parseInt(getStateVal(label), 10) >= 18 && parseInt(getStateVal(label), 10) <= 60) {
            cssHidden[formatToCamel(`${label}Hidden`)] = { visibility: 'hidden' };
            valid += 1;
          }
          break;
        case 'date':
          if (validateAge(getStateVal(label)) >= 18) {
            cssHidden[formatToCamel(`${label}Hidden`)] = { visibility: 'hidden' };
            valid += 1;
          }
          break;
        case 'radio':
          cssHidden[formatToCamel(`${label}Hidden`)] = { visibility: 'hidden' };
          valid += 1;
          break;
        default:
          break;
      }
    });
    if (valid === formSchemaSubmitted.length) {
      setSuccess(true);
      setValidate(true);
    } else {
      setValidate(false);
    }
    setState({ ...state, ...cssHidden });
  };

  const generateInput = ({ label, type }) => (
    <div key={`${label}${type}`} style={getStateVal(`${label}Hidden`)}>
      <p>{label}:</p>
      <InputForm
        type={type}
        style={getStateVal(`${label}Error`)}
        value={getStateVal(label)}
        onChange={event => handleChange(event, label, type)}
      />
    </div>
  );

  return (
    <MainDiv>
      {success && <p>Form successfully submitted!</p>}
      {!(success) && (
        <form onSubmit={event => handleSubmit(event, formSchema)} noValidate>
          { formSchema.map(generateInput) }
          {!(validate) && <p>Some fields were not correctly filled!</p>}
          <input type="submit" value="Submit" />
        </form>
      )}
    </MainDiv>
  );
};

FormBuilder.propTypes = {
  formSchema: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default FormBuilder;
