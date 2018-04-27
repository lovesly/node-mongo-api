const axios = require('axios');

// async version api
const getExchangeRate = async (from, to) => {
    try {
        const response = await axios.get(`http://api.fixer.io/latest?base=${from}`);
        const rate = response.data.rates[to];
        if (rate) {
            return rate;
        }
        // stupid fucking no-else-return rule
        throw new Error();
    } catch (e) {
        throw new Error(`Unable to get exchange rate for ${from} and ${to}`);
    }
};

// old version. axios returns a promise
// unhandled promise???
const getCountries = async (currencyCode) => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        return response.data.map(country => country.name);
    } catch (e) {
        throw new Error(`Unable to get countries that use ${currencyCode}.`);
    }
};

// old version convert
const convertCurrency = (from, to, amount) => {
    // what's the point of calling getCountries??
    let countries;
    return getCountries(to).then((tmpCountries) => {
        countries = tmpCountries;
        return getExchangeRate(from, to);
    }).then((rate) => {
        const exchangedAmount = rate * amount;
        // string template linebreak issue
        return [
            `${amount} ${from} is worth ${exchangedAmount.toFixed(2)} ${to}.`,
            `${to} can be used in the following countries: ${countries.join(',')}`].join(' ');
    });
};

// async version
// much more readable
const convertCurrencyAlt = async (from, to, amount) => {
    const countries = await getCountries(to);
    const rate = await getExchangeRate(from, to);
    const exchangedAmount = rate * amount;
    return `${amount} ${from} is worth ${exchangedAmount.toFixed(2)} ${to}. \
${to} can be used in the following countries: ${countries.join(',')}`;
};

getCountries('HKD').then((data) => {
    console.log(data);
}).catch(e => console.log(e.message));

getExchangeRate('USD', 'CNY')
    .then(rate => console.log(rate))
    .catch(e => console.log(e));
// convertCurrency('USD', 'CNY', 40000)
//     .then(msg => console.log(msg))
//     .catch(e => console.log(e));

convertCurrencyAlt('USD', 'CNY', 40000)
    .then(msg => console.log(msg))
    .catch(e => console.log(e));

