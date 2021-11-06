// 请使用优化以下代码：

// 假设已经存在以下3个函数，3个函数的功能都是向服务器上传文件，根据不同的上传类型参数都会不一样。内容的实现这里无须关注
// 请重新设计一个功能，根据不同文件的后缀名，上传到不同的服务器。
// txt 上传到 ftp
// exe 上传到 sftp
// doc 上传到 http


interface LogOpt {
    module?: string;
    target?: string;
    event?: string;
    result?: any
}
interface Iupload {
    (file: string): Promise<boolean>
}
interface FileMap {
    [key: string]: string
}
interface ActionFn {
    action: Iupload
}
interface ActionsMap {
    [key: string]: ActionFn
}
const NORMAL_REG = /\.(\w+)$/;

// 制程阶段
let actionsMap: ActionsMap = {
    ftp: { action: uploadByFtp },
    sftp: { action: uploadBySftp },
    http: { action: uploadByHttp }
};

let fileMap: FileMap = {
    txt: 'ftp',
    exe: 'sftp',
    doc: 'http'
};

function uploadByFtp (file: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
}
function uploadBySftp (file: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
}
function uploadByHttp (file: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
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

// 实现如下
function upload (files: string[], cb?: Function): Promise<boolean> {
    logFn({ module: 'upload', target: 'files', result: files }, 'trace');
    return Promise.all(files.map(file => {
        const ext = file.match(NORMAL_REG)?.[1];
        let fileOpr = fileMap[ext as string];

        logFn({ module: 'upload promise', result: '....' });

        if (!fileOpr || !actionsMap[fileOpr]) { return; }
        return actionsMap[fileOpr].action(file);
    })).then(() => {
        logFn({result: 'upload success.'});
        cb?.();
        return true;
    })
}


