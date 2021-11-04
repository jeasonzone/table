interface LogOpt {
    module?: string;
    target?: string;
    event?: string;
    result?: any
}

export type ConsoleType = 'log' | 'info' | 'error' | 'trace'; 
export function logFn (type: ConsoleType, opt: LogOpt) {
    let time = new Date();

    let desc = '';
    opt.module && (desc += ' module: ----- ' + opt.module + '\n');
    opt.target && (desc += ' target: ----- ' + opt.target + '\n');
    opt.event && (desc += ' event: ----- ' + opt.event + '\n');
    opt.result && (desc += ' result: ----- ' + JSON.stringify(opt.result) + '\n');

    console[type]('-----------------------------' + '\n' +
        `time: ---${time}\n ${desc}` +
        '-----------------------------');
}