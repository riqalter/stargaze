// todo: fix false css injection COK.

import { getRandomNumber } from "./getRandomNum";
import { getRandomColor } from "./getRandomColor";

export const theBackground = () => {
    const background = []
    for (let i = 0; i < getRandomNumber(); i++) {
        background.push(`
            radial-gradient(
                circle at ${getRandomNumber(100)}% ${getRandomNumber(100)}%,
                ${getRandomColor() + '0d'},
                transparent ${getRandomNumber(100, 60)}%
            )
        `)
    }
    return background.join(';')
}

