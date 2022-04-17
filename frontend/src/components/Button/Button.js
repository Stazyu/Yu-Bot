import React, { Component } from 'react';

const clearQr = () => {
    localStorage.removeItem('qr');
    window.location.reload();
}

export default class Button extends Component {
    render() {
        return (
            <button onClick={() => clearQr()}>Refresh Qr Code</button>
        )
    }
}
