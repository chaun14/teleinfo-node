module.exports = {
	HISTORIQUE: {
		baudRate: 1200,
		separator: ' ',
		computeChecksum: (line) => {
			// Spec chk : somme des codes ASCII + ET logique 03Fh + ajout 20 en hexadécimal
			// Résultat toujours un caractère ASCII imprimable allant de 20 à 5F en hexadécimal
			// Checksum calculé sur etiquette+space+données => retirer les 2 derniers caractères
			var sum = 0;
			for (var j=0; j < line.length-2; j++) {
				sum += line.charCodeAt(j);
			}
			return (sum & 63) + 32;
		},
		labels: {
			'ADCO': { numeric: false },
			'OPTARIF': { numeric: false },
			'PTEC': { numeric: false },
			'DEMAIN': { numeric: false },
			'HHPHC': { numeric: false },
			'MOTDETAT': { numeric: false },
			'PPOT': { numeric: false },
			'ISOUSC': { numeric: true },
			'BASE': { numeric: true },
			'HCHC': { numeric: true },
			'HCHP': { numeric: true },
			'EJPHN': { numeric: true },
			'EJPHPM': { numeric: true },
			'BBRHCJB': { numeric: true },
			'BBRHPJB': { numeric: true },
			'BBRHCJW': { numeric: true },
			'BBRHPJW': { numeric: true },
			'BBRHCJR': { numeric: true },
			'BBRHPJR': { numeric: true },
			'PEJP': { numeric: true },
			'IINST': { numeric: true },
			'IINST1': { numeric: true },
			'IINST2': { numeric: true },
			'IINST3': { numeric: true },
			'ADPS': { numeric: true },
			'IMAX': { numeric: true },
			'IMAX1': { numeric: true },
			'IMAX2': { numeric: true },
			'IMAX3': { numeric: true },
			'PMAX': { numeric: true },
			'PAPP': { numeric: true },
		}
	},
	STANDARD: {
		baudRate: 9600,
		separator: '\t',
		computeChecksum: (line) => {
			// Spec chk : somme des codes ASCII + ET logique 03Fh + ajout 20 en hexadécimal
			// Résultat toujours un caractère ASCII imprimable allant de 20 à 5F en hexadécimal
			// Checksum calculé sur etiquette+tab+données(+tab+données)+tab => retirer le dernier caractères
			var sum = 0;
			for (var j=0; j < line.length-1; j++) {
				sum += line.charCodeAt(j);
			}
			return (sum & 63) + 32;
		},
		labels: {
			'ADSC': { numeric: false, date: false },
			'VTIC': { numeric: true, date: false },
			'DATE': { numeric: false, date: true },
			'NGTF': { numeric: false, date: false },
			'LTARF': { numeric: false, date: false },
			'EAST': { numeric: true, date: false },
			'EASF01': { numeric: true, date: false },
			'EASF02': { numeric: true, date: false },
			'EASF03': { numeric: true, date: false },
			'EASF04': { numeric: true, date: false },
			'EASF05': { numeric: true, date: false },
			'EASF06': { numeric: true, date: false },
			'EASF07': { numeric: true, date: false },
			'EASF08': { numeric: true, date: false },
			'EASF09': { numeric: true, date: false },
			'EASF10': { numeric: true, date: false },
			'EASD01': { numeric: true, date: false },
			'EASD02': { numeric: true, date: false },
			'EASD03': { numeric: true, date: false },
			'EASD04': { numeric: true, date: false },
			'EAIT': { numeric: true, date: false },
			'ERQ1': { numeric: true, date: false },
			'ERQ2': { numeric: true, date: false },
			'ERQ3': { numeric: true, date: false },
			'ERQ4': { numeric: true, date: false },
			'IRMS1': { numeric: true, date: false },
			'IRMS2': { numeric: true, date: false },
			'IRMS3': { numeric: true, date: false },
			'URMS1': { numeric: true, date: false },
			'URMS2': { numeric: true, date: false },
			'URMS3': { numeric: true, date: false },
			'PREF': { numeric: true, date: false },
			'PCOUP': { numeric: true, date: false },
			'SINSTS': { numeric: true, date: false },
			'SINSTS1': { numeric: true, date: false },
			'SINSTS2': { numeric: true, date: false },
			'SINSTS3': { numeric: true, date: false },
			'SMAXSN': { numeric: true, date: true },
			'SMAXSN1': { numeric: true, date: true },
			'SMAXSN2': { numeric: true, date: true },
			'SMAXSN3': { numeric: true, date: true },
			'SMAXSN-1': { numeric: true, date: true },
			'SMAXSN1-1': { numeric: true, date: true },
			'SMAXSN2-1': { numeric: true, date: true },
			'SMAXSN3-1': { numeric: true, date: true },
			'SINSTI': { numeric: true, date: false },
			'SMAXIN': { numeric: true, date: true },
			'SMAXIN-1': { numeric: true, date: true },
			'CCASN': { numeric: true, date: true },
			'CCASN-1': { numeric: true, date: true },
			'CCAIN': { numeric: true, date: true },
			'CCAIN-1': { numeric: true, date: true },
			'UMOY1': { numeric: true, date: true },
			'UMOY2': { numeric: true, date: true },
			'UMOY3': { numeric: true, date: true },
			'STGE': { numeric: false, date: false },
			'DPM1': { numeric: false, date: true },
			'FPM1': { numeric: false, date: true },
			'DPM2': { numeric: false, date: true },
			'FPM2': { numeric: false, date: true },
			'DPM3': { numeric: false, date: true },
			'FPM3': { numeric: false, date: true },
			'MSG1': { numeric: false, date: false },
			'MSG2': { numeric: false, date: false },
			'PRM': { numeric: false, date: false },
			'RELAIS': { numeric: false, date: false },
			'NTARF': { numeric: false, date: false },
			'NJOURF': { numeric: false, date: false },
			'NJOURF+1': { numeric: false, date: false },
			'PJOURF+1': { numeric: false, date: false },
			'PPOINTE': { numeric: false, date: false },
		}
	}
};
