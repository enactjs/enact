class LS2Request {
    async send(config) {
        let { service, method, onSuccess, onFailure, onComplete, parameters } = config;
        const matches = /luna:\/\/(.*)/.exec(service);

        if (!matches) {
            onFailure();
            return;
        }

        try {
            const res = require('../../responseMock.js');

            if (res && res.responseMock && res.responseMock[method] && res.responseMock[method].returnValue) {
                let response = res.responseMock[method];
                if (method === 'getSystemSettings') {
                    if (parameters.key) {
                        response = res.responseMock[method].key;
                    } else if (parameters.keys) {
                        const res1 = {};

                        for (let i = 0; i < parameters.keys.length; i++) {
                            if (res1.settings) {
                                Object.assign(res1.settings, res.responseMock[method][parameters.keys[i]].settings);
                            } else {
                                Object.assign(res1, res.responseMock[method][parameters.keys[i]]);
                            }
                        }

                        response = res1;
                    }
                } else if (method === 'getProperties') {
                    const splittedService = service.split('.');
                    const svc = splittedService[splittedService.length - 1];
                    response = res.responseMock[method][svc];
                }

                if (onSuccess) {
                    onSuccess(response);
                } else if (onComplete) {
                    onComplete(response);
                }
            } else {
                const err = (res && res.responseMock && res.responseMock[method]) || { returnValue: false, errorCode: '0000' };

                if (onFailure) {
                    onFailure(err);
                } else if (onComplete) {
                    onComplete(err);
                }
            }
        } catch (e) {
            console.log(e);

            if (onFailure) {
                onFailure({ returnValue: false });
            }
        }
    }
    cancel() {
        // console.log('cancel ls call');
    }
}

export default LS2Request;
