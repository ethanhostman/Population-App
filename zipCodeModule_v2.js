let data = require('./zips.json');


module.exports.lookupByZipCode =  (zip) => {
	return data.find(obj => obj._id === zip);
};

module.exports.lookupByCityState = (city, state) => {
	const result = data.filter(obj => obj.city === city && obj.state === state);
        return {city: city, state: state, data: result.map(obj => {return {zip: obj._id, pop: obj.pop}})};
};

module.exports.getPopulationByState = (state) => {
	function addPopulation(total, obj) {
        if (obj.state === state) {
            return total + obj.pop;
        }
        return total;
    }
    return {state: state, pop: data.reduce(addPopulation, 0)};
};

