import { readdir, lstat } from "fs/promises";
import { join as pathJoin, relative as pathRelative } from "path";
import { realpath as fsRealpath } from "fs/promises";

async function crawlRec(params: {
    dirPath: string;
    getDoCrawlInDir: (prams: { dirPath: string }) => boolean | Promise<boolean>;
}) {
    const { dirPath, getDoCrawlInDir } = params;

    const filePaths: string[] = [];

    const recursiveCallResults: string[][] = [];

    await Promise.all(
        (
            await readdir(await fsRealpath(dirPath))
        ).map(async fileOrDirectoryBasename => {
            const fileOrDirectoryPath = pathJoin(dirPath, fileOrDirectoryBasename);

            if ((await lstat(await fsRealpath(fileOrDirectoryPath))).isDirectory()) {
                const dirPath = fileOrDirectoryPath;

                if (!(await getDoCrawlInDir({ dirPath }))) {
                    return;
                }

                recursiveCallResults.push(
                    await crawlRec({
                        dirPath,
                        getDoCrawlInDir
                    })
                );

                return;
            }

            const filePath = fileOrDirectoryPath;

            filePaths.push(filePath);
        })
    );

    return [filePaths, ...recursiveCallResults].flat();
}

/** List all files in a given directory return paths relative to the dirPath */
export async function crawl(params: {
    dirPath: string;
    getDoCrawlInDir?: (prams: { relativeDirPath: string }) => boolean | Promise<boolean>;
}) {
    const { dirPath: rootDirPath, getDoCrawlInDir = () => true } = params;

    const filePaths = await crawlRec({
        "dirPath": rootDirPath,
        "getDoCrawlInDir": ({ dirPath }) =>
            getDoCrawlInDir({ "relativeDirPath": pathRelative(rootDirPath, dirPath) })
    });

    return filePaths.map(filePath => pathRelative(rootDirPath, filePath));
}
