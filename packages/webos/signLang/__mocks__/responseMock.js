const sportProgramListResponse = {
    "accountNumber": "823400",
    "category_apps": "Y",
    "count": 58,
};

export const responseMock = {
    'play': {
        returnValue: true,
    },
    getSystemSettings: {
        returnValue: true,
        lastInputApp: {
            settings: {
                lastInputApp: 'com.webos.app.livetv'
            }
        },
        signLanguageGuidance: {
            settings: {
                signLanguageGuidance: 'on'
            }
        },
        mySportTeamList: {
            settings: {
                mySportTeamList: [
                    {
                        alarms: {
                            scoreChange: 'off',
                            beforeOneMin: 'off',
                            finalScore: 'off'
                        },
                        ids: {
                            sport: 'GN3FAZE2HJTVDJ9',
                            teamOrPlayer: 'GN5DKKJDG87DD5E',
                            league: 'GNCH1JZA56P7PKE'
                        },
                        sportsEventType: '1',
                        _id: '32e91'
                    },
                    {
                        alarms: {
                            scoreChange: 'off',
                            beforeOneMin: 'on',
                            finalScore: 'on'
                        },
                        ids: {
                            sport: 'GN3FAZE2HJTVDJ9',
                            league: 'GN9V1DPKVG63Y59',
                            teamOrPlayer: 'GN34M7GVWV2Q4TS'
                        },
                        sportsEventType: '1',
                        _id: '32e92'
                    },
                    {
                        alarms: {
                            scoreChange: 'off',
                            beforeOneMin: 'on',
                            finalScore: 'on'
                        },
                        ids: {
                            sport: 'GNFB17MNF4TH4KM',
                            league: 'GNFMPKV46ED03JE',
                            teamOrPlayer: 'GN1NKHKNE81WZNW'
                        },
                        sportsEventType: '1',
                        _id: '32e93'
                    },
                    {
                        alarms: {
                            scoreChange: 'off',
                            beforeOneMin: 'on',
                            finalScore: 'on'
                        },
                        ids: {
                            sport: 'GNBF6D927MH62TN',
                            league: 'GN87DRG1TQJXGNH',
                            teamOrPlayer: 'GN42BYQZC9MXCE5'
                        },
                        sportsEventType: '2',
                        _id: '32e94'
                    },
                    {
                        alarms: {
                            scoreChange: 'off',
                            beforeOneMin: 'on',
                            finalScore: 'on'
                        },
                        ids: {
                            sport: 'GNFB17MNF4TH4KM',
                            league: 'GNEZP5M6NX9H731',
                            teamOrPlayer: 'GN42BYQZC9M27HN'
                        },
                        sportsEventType: '1',
                        _id: '32e95'
                    }
                ]
            }
        },
        sportsAlarm: {
            settings: {
                sportsAlarm: 'on'
            }
        },
        sportsPicker: {
            settings: {
                sportsPicker: 'GN3FAZE2HJTVDJ9'
            }
        }

    },
}

export const getResponseMock = api => {
    return responseMock[api];
};

export const setResponseMock = (api, obj) => {
    responseMock[api] = obj;
};
