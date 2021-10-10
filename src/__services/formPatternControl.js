
export const checkPassword = (password) => {
    const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,20}$/)
    return regex.test(password)
}

export const checkStringLenght = (str, min, max) => {
    return str.length >= min && str.length <= max
}