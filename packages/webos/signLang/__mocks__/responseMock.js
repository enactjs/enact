
export const responseMock = {
    'play': {
        returnValue: true,
    },
    getSystemSettings: {
        returnValue: true,
        signLanguageGuidance: {
            settings: {
                signLanguageGuidance: 'on'
            }
        },
    },
}

export const getResponseMock = api => {
    return responseMock[api];
};

export const setResponseMock = (api, obj) => {
    responseMock[api] = obj;
};
