var SerialPort = require('serialport');
var events = require('events');

function teleinfo(portName) {
	// Evénements 'trame' et 'tramedecodee'
	var trameEvents = new events.EventEmitter();
	
	const Readline = require('@serialport/parser-readline');
	const port = new SerialPort(portName, {
		baudRate: 1200,
		dataBits: 7,
		parity: 'even',
		stopBits: 1
	});
	const parser = port.pipe(new Readline({ delimiter: String.fromCharCode(13,3,2,10) })); // Caractères séparateurs = fin de trame + début de trame
	
	parser.on('data', function(data) {
		trameEvents.emit('trame', data);
	});

	port.on('error', function(err) {
		trameEvents.emit('error', err);
	});

	trameEvents.on('trame', function(data) {
		// Decode trame '9 lignes en tarif bleu base'
		var trame = {};
		var arrayOfData = data.split('\r\n');
		for (var i=0; i < arrayOfData.length; i++) {
			decodeLigne(arrayOfData[i], trame, trameEvents);
		}
		// trame incomplete s'il manque la première ligne ADCO
		if (!(trame.ADCO===undefined) && (!(trame.BASE===undefined) || (!(trame.HCHP===undefined) && !(trame.HCHC===undefined)))) {
			trameEvents.emit('tramedecodee', trame);
		}
		else {
			var err = new Error('Trame incomplete');
			trameEvents.emit('error', err);
		}
	});

	return trameEvents;
}


function decodeLigne(ligneBrute, trame, trameEvents) {
	// Ligne du type "PAPP 00290 ," (Etiquette / Donnée / Checksum)
	var elementsLigne = ligneBrute.split(' ');
	if (elementsLigne.length >= 3) {
		// Spec chk : somme des codes ASCII + ET logique 03Fh + ajout 20 en hexadécimal
		// Résultat toujours un caractère ASCII imprimable allant de 20 à 5F en hexadécimal
		// Checksum calculé sur etiquette+space+données => retirer les 2 derniers caractères
		var sum = 0;
		for (var j=0; j < ligneBrute.length-2; j++) {
			sum += ligneBrute.charCodeAt(j);
		}
		sum = (sum & 63) + 32;
		if (sum === ligneBrute.charCodeAt(j+1)) {
			// Checksum ok -> on ajoute la propriété à la trame
			// Conversion en valeur numérique pour certains cas
			switch (elementsLigne[0].substr(0,4)) {
				case 'BASE': // Index Tarif bleu
				case 'HCHC': // Index Heures creuses
				case 'HCHP': // Index Heures pleines
				case 'EJPH': // Index EJP (HN et HPM)
				case 'BBRH': // Index Tempo (HC/HP en jours Blanc, Bleu et Rouge)
				case 'ISOU': // Intensité souscrite
				case 'IINS': // Intensité instantannée (1/2/3 pour triphasé)
				case 'ADPS': // Avertissement de dépassement
				case 'IMAX': // Intensité max appelée (1/2/3 pour triphasé)
				case 'PAPP': // Puissance apparente
				case 'PMAX': // Puissance max triphasée atteinte
					trame[elementsLigne[0]]= Number(elementsLigne[1]);
					break;
				default:
					trame[elementsLigne[0]]= elementsLigne[1];
			}
			return true;
		} else {
			var err = new Error('Erreur de checksum : \n' + ligneBrute + '\n Checksum calculé/reçu : ' + sum + ' / ' + ligneBrute.charCodeAt(j+1)); 
			trameEvents.emit('error', err);
		}
	};
};


module.exports = teleinfo;

