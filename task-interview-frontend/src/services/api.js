import axios from 'axios';

export default axios.create({
    baseURL: 'https://consent-irritably-mouse.ngrok-free.dev/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
});