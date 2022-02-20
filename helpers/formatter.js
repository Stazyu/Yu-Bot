function bytesToMB(x) {
	const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let l = 0, n = parseInt(x, 10) || 0;
	while (n >= 1024 && ++l) {
		n = n / 1024;
	}
	return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

function bytesToMb(x) {
	const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
	let l = 0, n = parseInt(x, 10) || 0;
	while (n >= 1000 && ++l) {
		n = n / 1000;
	}
	return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

module.exports = { bytesToMB, bytesToMb }