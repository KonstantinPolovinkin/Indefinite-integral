/* eslint-disable linebreak-style */
/* eslint-disable template-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable camelcase */
'use strict';

const WebSocket = require('ws');
const port = 5000;
const server = new WebSocket.Server({ port });

server.on('connection', ws => {
  ws.on('message', message => {
    if (message === 'exit') {
      ws.close();
    } else {
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send((defineIntegralType(message)));
          //client.send(`${message} + 1`);
        }
      });
    }
  });
  const newLocal = 'Input integral to solve';
  ws.send(newLocal);
});



function stringReplaceSymbol(value) {
  value = value.replace(/\s/g, '');
  value = value.replace(/(\^\(-)/g, '$');
  value = value.replace(/-/g, ' -');
  //value = value.replace(/\*/g, ' ');
  //value = value.replace(/\//g, ' ');
  value = value.replace(/\+/g, ' ');
  return (value);
}

function stringSplit(value) {
  value = value.split(/\s/g);

  value.forEach((item, itemIndex) => {
    if (item.includes('$')) {
      const newItem = item.replace('$', '^(-');
      value.splice(itemIndex, 1, newItem);
    }
  });
  return value;
}

function getEnteredData(message) {
  const enteredData = stringSplit(stringReplaceSymbol(message));
  return enteredData;
}

function getDifferential() {
  return 'x';//document.getElementById('dx').value;
}

function zeroIntegral() {
  return ('C');
}

function constantIntegral(value) {
  return (value + getDifferential() + ' + C');
}

function exponentIntegral(value) {
  const exponentDetermination = () => {
    const calculateExponent = eval(value.slice(value.indexOf('^') + 2, value.indexOf(')')));
    return (
      Math.round(calculateExponent * 1000) / 1000
    );
  };
  return (`(${value.slice(0, value.indexOf('^'))}^${Math.round((exponentDetermination() + 1) * 1000) / 1000} / ${Math.round((exponentDetermination() + 1) * 1000) / 1000}) + C`);
}

function logarithmicIntegral(value) {
  const nonIntegrandConstant = `(${ value.slice(0, value.indexOf('/')) } / ${ value.slice(value.indexOf('(') + 1, value.indexOf('x') + 1) })`;
  const integrationVariable = getDifferential();
  //let integrationVariable = value.slice(value.indexOf('x'), value.indexOf('x') + 1);
  return (`${nonIntegrandConstant} * ln|${integrationVariable}| + C`);
}

function exponentialFunctionIntegral_type1(value) {
  const numerator = value;
  const denominator = value.slice(0, value.indexOf('^'));

  return (`${numerator} / (ln|${denominator}|) + C`);
}

function exponentialFunctionIntegral_type2(value) {
  const result = value.slice(0);
  return (`${result} + C`);
}

function sinIntegral_type1(value) {
  const integrationVariable = value.slice(value.indexOf('(') + 1, value.indexOf(')'));
  return (`-(${ value.slice(0, value.indexOf('s')) })cos${integrationVariable} + C`);
}

function cosIntegral_type1(value) {
  const integrationVariable = value.slice(value.indexOf('(') + 1, value.indexOf(')'));
  return (`(${ value.slice(0, value.indexOf('c')) })sin${integrationVariable} + C`);
}

function sinIntegral_type2(value) {
  const integrationVariable = value.slice(value.indexOf(')') + 2, value.indexOf('x') + 1);
  return (`-${ value.slice(0, value.indexOf('s')) }ctg(${integrationVariable}) + C`);
}

function cosIntegral_type2(value) {
  const integrationVariable = value.slice(value.indexOf(')') + 2, value.indexOf('x') + 1);
  return (`${ value.slice(0, value.indexOf('c')) }tg(${integrationVariable}) + C`);
}

function defineIntegralType(message) {
  const arr = [];
  for (const item of getEnteredData(message)) {
    if (!item.includes('x') && !item.includes('0')) {
      arr.push(constantIntegral(item));

    } else if (item === '0') {
      arr.push(zeroIntegral());

    } else if (item === `${ item.slice(0, item.indexOf('^')) }^(${ item.slice(item.indexOf('(') + 1, item.indexOf(')')) })`) {
      arr.push(exponentIntegral(item));

    } else if (item === `${ item.slice(0, item.indexOf('/')) }/(${ item.slice(item.indexOf('(') + 1, item.indexOf(')')) })`) {
      arr.push(logarithmicIntegral(item));

    } else if (item === `${ item.slice(0, item.indexOf(`^(${getDifferential()})`)) }^(${getDifferential()})`) {
      arr.push(exponentialFunctionIntegral_type1(item));

    } else if (item.includes('e^')) {
      arr.push(exponentialFunctionIntegral_type2(item));

    } else if (item === `${ item.slice(0, item.indexOf('s')) }sin(${ item.slice(item.indexOf('(') + 1, item.indexOf(')')) })`) {
      arr.push(sinIntegral_type1(item));

    } else if (item === `${ item.slice(0, item.indexOf('c')) }cos(${ item.slice(item.indexOf('(') + 1, item.indexOf(')')) })`) {
      arr.push(cosIntegral_type1(item));

    } else if (item.includes('sin^')) {
      arr.push(sinIntegral_type2(item));

    } else if (item.includes('cos^')) {
      arr.push(cosIntegral_type2(item));
    }
  }
  return arr.join(', ');
}
