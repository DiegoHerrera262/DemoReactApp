import axios from 'axios';

const postClient = (data) => {
    const defaultURl = 'http://localhost:8000/grocers/create';
    try {
        for (let value of data.values()) {
            console.log(value)
        }
    } catch (error) {
        return error;
    }
}

export {postClient};