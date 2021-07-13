import axios from "axios";

const postBonus = (data) => {
    for (var pair of data.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }
}

export { postBonus };