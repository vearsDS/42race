import fs from 'fs';
import path from 'path';

const walkSync = (dir, fileList = []) => {
    fs.readdirSync(dir).map(file => {
        fileList = fs.statSync(path.join(dir, file)).isDirectory() ?
            walkSync(path.join(dir, file), fileList) :
            fileList.concat(path.join(dir, file));
    });
    return fileList;
};

export default walkSync;