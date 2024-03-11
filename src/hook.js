import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function isNumber(value) {
    return typeof value === "number" && !isNaN(value);
}

function parseQueryString(input) {
    const obj = {};
    if (input) {
        const sanitizedInput = input[0] === "?" ? input.slice(1) : input;
        sanitizedInput.replace(/\+/g, " ").split(/[&;]/).forEach(it);
    }
    return obj;

    function it(pair) {
        const len = pair.length;
        if (!len) return;
        let pos = pair.indexOf("=");
        if (pos < 0) pos = len;

        const key = decodeURIComponent(pair.substr(0, pos));
        const value = decodeURIComponent(pair.substr(pos + 1));
        const currentValue = obj[key];

        if (currentValue) {
            if (Array.isArray(currentValue)) {
                currentValue.push(value);
            } else {
                obj[key] = [currentValue, value];
            }
        } else {
            obj[key] = value;
        }
    }
}

function stringifyQueryString(params, preText="") {
    if (!params) {
        return "";
    }

    const result = [];
    function collectPair(key, value) {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }

    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = params[key];
            if (isNumber(value) || value) {
                if (Array.isArray(value)) {
                    value.forEach((val) => collectPair(key, val));
                } else {
                    collectPair(key, value);
                }
            }
        }
    }
    return preText + result.join("&");
}

export const useQueryParams = () => {
    const location = useLocation();
    const params = React.useMemo(() => parseQueryString(location.search));
    return params;
}

export const useSetQueryParams = () => {
    const currentParam = useQueryParams();
    const navigate = useNavigate();

    return function setQueryParams(prefixRouter="", newParams={}, options) {
        const mergeParams = options && options.merge ? {
                ...currentParam,
                ...newParams,
            } : newParams;
        
        navigate(`${prefixRouter}?${stringifyQueryString(mergeParams)}`)
    }
}
