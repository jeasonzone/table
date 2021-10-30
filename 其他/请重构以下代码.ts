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
const NORMAL_REG = /\.(\w+)$/;

// 制程阶段
let actionsMap = {
    ftp: { action: uploadByFtp },
    sftp: { action: sftpFn },
    http: { action: Promise.resolve(uploadByHttp) }
};

let fileMap = {
    txt: 'ftp',
    exe: 'sftp',
    doc: 'http'
};

function sftpFn (file) {
    
    new Promise((resolve, reject) => {
        let cb = ret => {
            if (ret) {
                resolve(true)
            } else {
                logFn('error', { module: 'upload for sftp', result: 'fail' });
                reject()
            }
        }
        uploadBySftp([file], cb);
    })
}

function uploadByFtp (file: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
}
function uploadBySftp (file: string[], cb: (ret: boolean) => void): void {
    cb(true)
}
function uploadByHttp (file: string): boolean {
    return true
}

function logFn (type, opt: LogOpt) {
    let time = new Date();
    
    console[type](`${time}--${opt.module}--${opt.target}--${opt.event}--${opt.result}`);
}

// 实现如下
function upload (files: string[]): Promise<boolean> {
    logFn('trace', { module: 'upload', target: 'files', result: files });
    return Promise.all(files.map(file => {
        const ext = file.match(NORMAL_REG)[1];
        let fileOpr = fileMap[ext];
        logFn('info', { module: 'upload promise', result: '....' });
        if (!fileOpr || !actionsMap[fileOpr]) { return; }
        actionsMap[fileOpr].action(file);
    })).then(() => {
        logFn('log', {result: 'upload success.'})
        return true
    })
}


