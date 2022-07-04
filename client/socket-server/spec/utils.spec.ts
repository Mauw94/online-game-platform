import 'jasmine'
import gameStateCleanup from '../src/utils/gameStateCleanup';
import dictionaryReader from '../src/utils/dictionaryReader'

describe('testing getting a random word', function () {
    it('should return a word with given input length of 4', async function () {
        var word = await dictionaryReader.retrieveWord(4);
        expect(word).toBeDefined()
        expect(word.length).toBeGreaterThanOrEqual(4)
    })
})

describe('check for gamestate cleanup happening', function () {
    it('should call gamestate cleanup', function () {
        gameStateCleanup.cleanUp();
        expect(gameStateCleanup.cleanUp()).toHaveBeenCalledTimes(1)
    })
})
