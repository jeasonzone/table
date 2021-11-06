interface LogOpt {
    module?: string;
    target?: string;
    event?: string;
    result?: any
}

export type ConsoleType = 'log' | 'info' | 'error' | 'trace'; 
export function logFn (opt: LogOpt, type: ConsoleType = 'log') {
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