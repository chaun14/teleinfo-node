const { SerialPort } = require('serialport');
let events = require('events');
let configs = require('./configs');
const { REPL_MODE_STRICT } = require('repl');
const { ReadlineParser } = require('@serialport/parser-readline');

function teleinfo(portName, config = configs.HISTORIQUE) {
	// Evénements 'trame' et 'tramedecodee'
	let trameEvents = new events.EventEmitter();

	const port = new SerialPort({
		path: portName,
		baudRate: config.baudRate,
		dataBits: 7,
		parity: 'even',
		stopBits: 1
	});
	const parser = port.pipe(new ReadlineParser({ delimiter: String.fromCharCode(13, 3, 2, 10) })); // Caractères séparateurs = fin de trame + début de trame

	parser.on('data', function (data) {
		trameEvents.emit('trame', data);
	});

	port.on('error', function (err) {
		trameEvents.emit('error', err);
	});

	trameEvents.on('trame', function (data) {
		let trame = {};
		// Decode trame '9 lignes en tarif bleu base'
		let arrayOfData = data.split('\r\n');
		for (let i = 0; i < arrayOfData.length; i++) {
			decodeLigne(arrayOfData[i], trame, trameEvents, config);
		}
		// trame incomplete s'il manque la première ligne ADCO
		if (trame.ADCO || trame.ADSC) {
			trameEvents.emit('tramedecodee', trame);
		}
		else {
			let err = new Error('Trame incomplete');
			trameEvents.emit('error', err);
		}
	});

	return trameEvents;
}


function decodeLigne(ligneBrute, trame, trameEvents, config) {
	let sum = config.computeChecksum(ligneBrute);
	let checksum = ligneBrute.charCodeAt(ligneBrute.length - 1);
	if (sum === checksum) {
		// Checksum ok -> on ajoute la propriété à la trame
		let elementsLigne = ligneBrute.split(config.separator);
		if (elementsLigne.length >= 3) {
			const label = elementsLigne[0];
			const props = config.labels[label];
			if (!props) {
				trameEvents.emit('error', new Error('Label inconnu: ' + label));
				return false;
			}
			if (props.date) {
				if (elementsLigne.length >= 4) {
					const date = convertDate(elementsLigne[1]);
					const value = props.numeric ? Number(elementsLigne[2]) : elementsLigne[2];
					if (Number.isNaN(date)) {
						trameEvents.emit('error', new Error('Date invalide: ' + elementsLigne[1]));
						return false;
					}
					if (Number.isNaN(value)) {
						trameEvents.emit('error', new Error('Valeur invalide: ' + elementsLigne[2]));
						return false;
					}
					if (label == 'DATE') {
						trame[label] = date.toISOString();
					} else {
						trame[label] = {
							date: date.toISOString(),
							value: props.numeric ? Number(elementsLigne[2]) : elementsLigne[2]
						};
					}
					return true;
				}
			} else {
				const value = props.numeric ? Number(elementsLigne[1]) : elementsLigne[1];
				if (Number.isNaN(value)) {
					trameEvents.emit('error', new Error('Valeur invalide: ' + elementsLigne[1]));
					return false;
				}
				trame[label] = props.numeric ? Number(elementsLigne[1]) : elementsLigne[1];
				return true;
			}
		}
	} else {
		let err = new Error('Erreur de checksum : \n' + ligneBrute + '\n Checksum calculé/reçu : ' + sum + ' / ' + checksum);
		trameEvents.emit('error', err);
	};
	return false;
};

function convertDate(str) {
	const dateStr = new String((new Date()).getFullYear()).substring(0, 2) + str.substring(1, 3) + '-' + str.substring(3, 5) + '-' + str.substring(5, 7) + 'T' + str.substring(7, 9) + ':' + str.substring(9, 11) + ':' + str.substring(11, 13) + 'Z';
	const timestamp = Date.parse(dateStr);
	if (Number.isNaN(timestamp)) {
		return timestamp;
	} else {
		return new Date(timestamp - (str.substring(0, 1) === 'E' ? (2 * 60 * 60 * 1000) : (60 * 60 * 1000)));
	}
};

module.exports = teleinfo;
module.exports.version = configs;

