let api_endpoint = "http://localhost/api/"
let home_page = "http://localhost:8100/"
let system = "develop"

if (process.env.NODE_ENV === 'production') {
    api_endpoint = 'https://www.djarv.com/api/'
    home_page = "https://www.djarv.com/3ClickLog"
    system = "prod"
}

export interface AppConfig {
    API_ENDPOINT: string,
    VERSION: string,
    NAME: string,
    TOKEN_NAME: string,
    ENV: string,
    HOME_PAGE: string,
    SYSTEM: string,
}

export const CONFIG: AppConfig = {
    API_ENDPOINT : api_endpoint,
    VERSION : "2.0.0",
    NAME : "3ClickLog",
    TOKEN_NAME : 'worklog_token',
    ENV: process.env.NODE_ENV,
    HOME_PAGE: home_page,
    SYSTEM: system
};
