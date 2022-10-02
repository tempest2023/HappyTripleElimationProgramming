export const randomString: (len: number) => string = (len) => {
    const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let res = '';
    while (len >= 0) {
        res += pool[Math.floor(pool.length * Math.random())];
        len--;
    }
    return res;
};

export const waitTimeout: (timeout: number) => Promise<void> = (timeout) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
};

export const getUrlParameters: () => any = () => {
    const query: any = window.location.search.substring(1);
    const params: any = {};
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        params[pair[0]] = pair[1];
    }
    return params;
};

export const getRandomElements: <Type>(arr: Array<Type>) => Type = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
