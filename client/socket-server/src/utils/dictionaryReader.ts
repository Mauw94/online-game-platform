import * as fs from 'fs';

class WordDictionaryReader {

    /**
     * Read and return a random word from text file.
     * @returns async reading and getting new word from .txt file;
     */
    public retrieveWord(letterCount: number): Promise<string> {
        return new Promise((rs, rj) => {
            fs.readFile('./src/wordDictionaries/' + letterCount + '-letter-word.txt', (err, data) => {
                if (err) rj(err);

                var wordArray = data.toString().split("\n");
                const randomWord = wordArray[Math.floor(Math.random() * wordArray.length)];
                rs(randomWord);
            });
        });
    }
}

export default new WordDictionaryReader();
