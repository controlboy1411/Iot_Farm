const moment = require('moment')
const dateformat = require('date-format')
const { ValueStandard, PropertyStandard } = require('./constant')

export function removeVietnameseAccent(str) {
    var map = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
        'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
        'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
        'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
        'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
        'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
        'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
        'đ': 'd', 'Đ': 'D',
    };
    
    return str.replace(/[àáảãạăằắẳẵặâầấẩẫậÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬèéẻẽẹêềếểễệÈÉẺẼẸÊỀẾỂỄỆìíỉĩịÌÍỈĨỊòóỏõọôồốổỗộơờớởỡợÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢùúủũụưừứửữựÙÚỦŨỤƯỪỨỬỮỰỳýỷỹỵỲÝỶỸỴđĐ]/g, function (char) {
        return map[char] || char;
    });
}

export const formatDate = (date, format) => {
    if (!format || !date) {
        return date
    }

    return dateformat(format, date)
}

export const formatDate_DDMMYYYY_to_YYYYMMDD = (dateStr) => {
    let date = String(dateStr)
    if (date.length !== 10) {
        return dateStr
    }

    return date.substring(6, 10) + '-' + date.substring(3, 5) + '-' + date.substring(0, 2)
}

export function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber || typeof(phoneNumber) !== 'string') {
        return phoneNumber
    }

    const newPhoneNumber = phoneNumber.substring(0, 4) + '.' + phoneNumber.substring(4, 7) + '.' + phoneNumber.substring(7, 10)
    return newPhoneNumber
}

export const validateTextFieldInputNumber = (event) => {
    let keyCode = event.keyCode || event.which
    if (keyCode == 8 || keyCode == 37 || keyCode == 39) {
        return  // Cho phép phím xóa, phím mũi tên trái phải được pass
    } else if (keyCode == 32) {
        event.preventDefault()  // Không cho phép ấn phím dấu cách
    } else {
        // Chỉ cho phép nhập các phím số từ 0 đến 9
        let key = Number(String.fromCharCode(event.keyCode))
        let regex = /[0-9]|\./
        if (!regex.test(key)) {
            event.preventDefault()
        }
    }
}

export const getPageShowForItem = (item, page, totalPage) => {
    let show
    if (item === 1) {
        if (page % 3 === 1 && page >= 1 && page <= totalPage) {
            show = page
        } else if (page % 3 === 2 && page - 1 >= 1 && page - 1 <= totalPage) {
            show = page - 1
        } else if (page % 3 === 0 && page - 2 >= 1 && page - 2 <= totalPage) {
            show = page - 2
        }
    }
    
    if (item === 2) {
        if (page % 3 === 1 && page + 1 >= 1 && page + 1 <= totalPage) {
            show = page + 1
        } else if (page % 3 === 2 && page >= 1 && page <= totalPage) {
            show = page
        } else if (page % 3 === 0 && page - 1 >= 1 && page - 1 <= totalPage) {
            show = page - 1
        }
    }

    if (item === 3) {
        if (page % 3 === 1 && page >= 1 && page + 2 <= totalPage) {
            show = page + 2
        } else if (page % 3 === 2 && page >= 1 && page + 1 <= totalPage) {
            show = page + 1
        } else if (page % 3 === 0 && page >= 1 && page <= totalPage) {
            show = page
        }
    }
    return show
}

export const getNearestHours = (numberMinutes, distanceMinutes) => {
    let _number = numberMinutes
    let _distance = distanceMinutes
    if (!numberMinutes || !distanceMinutes) {
        _number = 60
        _distance = 10
    }

    const thisMinute = moment().minutes()
    let minute = thisMinute - thisMinute % _distance
    let hour = moment().hours()
    let date = new Date()

    let result = []
    const numberTimeLine = Math.ceil(_number/_distance) + 1
    
    for (let i = 1; i <= numberTimeLine; i++) {
        minute = i === 1 ? minute : minute - _distance
        if (minute < 0) {
            minute = minute + 60
            hour = hour - 1
            if (hour < 0) {
                hour = hour + 24
                date.setDate(date.getDate() - 1)
            }
        }

        let timeLine = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute)
        result.push(formatDate(timeLine, 'yyyy-MM-dd hh:mm:ss'))
    }

    return result.reverse()
}

const getTemperatureStandard = (temp, minValue, maxValue) => {
    let standard = ''
    if (temp >= minValue && temp <= maxValue) {
        standard = ValueStandard.Good
    } else if ((temp >= minValue - 1 && temp < minValue) || (temp > maxValue && temp <= maxValue + 1)) {
        standard = ValueStandard.Medium
    } else {
        standard = ValueStandard.Bad
    }
    return standard
}

const getWindSpeedStandard = (windSpeed, minValue, maxValue) => {
    let standard = ''
    if (windSpeed >= minValue && windSpeed <= maxValue) {
        standard = ValueStandard.Good
    } else {
        standard = ValueStandard.Medium
    }
    return standard
}

const getHumidityStandard = (humidity, minValue, maxValue) => {
    let standard = ''
    if (humidity >= minValue && humidity <= maxValue) {
        standard = ValueStandard.Good
    } else {
        standard = ValueStandard.Medium
    }
    return standard
}

const getCo2Standard = (co2, maxValue) => {
    if (co2 <= maxValue) {
        return ValueStandard.Good
    }
    return ValueStandard.Bad
}

export const getHouseStandard = (week, props) => {
    let standard = {}
    switch (week) {
        case 1:
            if (props[PropertyStandard.Temp]) {
                standard[PropertyStandard.Temp] = getTemperatureStandard(Number(props[PropertyStandard.Temp]), 32, 35)
            }
            if (props[PropertyStandard.WinSpeed]) {
                standard[PropertyStandard.WinSpeed] = getWindSpeedStandard(Number(props[PropertyStandard.WinSpeed]), 50, 100)
            }
            break
        case 2:
            if (props[PropertyStandard.Temp]) {
                standard[PropertyStandard.Temp] = getTemperatureStandard(Number(props[PropertyStandard.Temp]), 29, 32)
            }
            if (props[PropertyStandard.WinSpeed]) {
                standard[PropertyStandard.WinSpeed] = getWindSpeedStandard(Number(props[PropertyStandard.WinSpeed]), 100, 150)
            }
            break
        case 3:
            if (props[PropertyStandard.Temp]) {
                standard[PropertyStandard.Temp] = getTemperatureStandard(Number(props[PropertyStandard.Temp]), 22, 31)
            }
            if (props[PropertyStandard.WinSpeed]) {
                standard[PropertyStandard.WinSpeed] = getWindSpeedStandard(Number(props[PropertyStandard.WinSpeed]), 100, 200)
            }
            break
        case 4:
            if (props[PropertyStandard.Temp]) {
                standard[PropertyStandard.Temp] = getTemperatureStandard(Number(props[PropertyStandard.Temp]), 22, 32)
            }
            if (props[PropertyStandard.WinSpeed]) {
                standard[PropertyStandard.WinSpeed] = getWindSpeedStandard(Number(props[PropertyStandard.WinSpeed]), 100, 250)
            }
            break
        case 5:
            if (props[PropertyStandard.Temp]) {
                standard[PropertyStandard.Temp] = getTemperatureStandard(Number(props[PropertyStandard.Temp]), 21, 32)
            }
            if (props[PropertyStandard.WinSpeed]) {
                standard[PropertyStandard.WinSpeed] = getWindSpeedStandard(Number(props[PropertyStandard.WinSpeed]), 250, 350)
            }
            break;
        case 11:
            if (props[PropertyStandard.Temp]) {
                standard[PropertyStandard.Temp] = getTemperatureStandard(Number(props[PropertyStandard.Temp]), 20, 32)
            }
            if (props[PropertyStandard.WinSpeed]) {
                standard[PropertyStandard.WinSpeed] = getWindSpeedStandard(Number(props[PropertyStandard.WinSpeed]), 300, 400)
            }
            break
        case 9:
            if (props[PropertyStandard.Temp]) {
                standard[PropertyStandard.Temp] = getTemperatureStandard(Number(props[PropertyStandard.Temp]), 21, 32)
            }
            if (props[PropertyStandard.Humi]) {
                standard[PropertyStandard.Humi] = getHumidityStandard(Number(props[PropertyStandard.Humi]), 60, 70)
            }
            if (props[PropertyStandard.Co2]) {
                standard[PropertyStandard.Co2] = getCo2Standard(Number(props[PropertyStandard.Co2]), 0.04)
            }
            if (props[PropertyStandard.WinSpeed]) {
                standard[PropertyStandard.WinSpeed] = getWindSpeedStandard(Number(props[PropertyStandard.WinSpeed]), 250, 350)
            }
            break
    }

    return standard
}