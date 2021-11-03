interface LogOpt {
    module?: string;
    target?: string;
    event?: string;
    result?: any
}
export function logFn (type: string, opt: LogOpt) {
    let time = new Date();
    
    console[type]('-----------------------------' + '\n' +
        `time: ---${time}\n module: ---${opt.module}\n target: ---${opt.target}\n event: ---${opt.event}\n result: ---${opt.result}\n` +
        '-----------------------------');
}