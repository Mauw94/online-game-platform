import 'jasmine'
import dictionaryReader from '../src/utils/dictionaryReader'

describe('testing getting a random word', function () {
    it('should return a word with given input length of 4', async function () {
        var word = await dictionaryReader.retrieveWord(4);
        expect(word).toBeDefined()
        expect(word.length).toBeGreaterThanOrEqual(4)
    })
})