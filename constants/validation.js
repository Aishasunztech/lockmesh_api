module.exports = {
    DEVICE_ID_PATTERN : /^([A-Za-z]{4})([0-9]{6})$/,
    USER_ID_PATTERN : /^ID([0-9]{6,})$/,
    SIM_ID_PATTERN : /^[0-9]{19,20}$/,
    // ICC_ID_PATTERN : /^[0-9]{19,20}$/,
    ALPHA_NUMERIC: /^[a-z0-9]{19,20}$/,
    EMAIL_REGEX : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    CHAT_ID: /^[0-9]{8}$/,
    DATE_REGEX: /^(1|3|6|12|([0-9]{4}\/(01|02|03|04|05|06|07|08|09|10|11|12)\/(01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31)))$/,
    ONLY_DATE_REGEX: /^([0-9]{4}\/(01|02|03|04|05|06|07|08|09|10|11|12)\/(01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31))$/,
    DATE_REGEX_WITH_NA: /^(N\/A|([0-9]{4}\/(01|02|03|04|05|06|07|08|09|10|11|12)\/(01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31)))$/,
    IMEI_REGEX: /^[0-9]{15}$/,
    BOOLEAN_REGEX: /^(true|false)$/,
    NUMERIC_BOOLEAN_REGEX: /^(0|1|true|false)$/,
}