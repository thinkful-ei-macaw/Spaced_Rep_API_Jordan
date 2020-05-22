const express = require('express')
const LanguageService = require('./language-service')
const {requireAuth} = require('../middleware/jwt-auth')
const languageRouter = express.Router()
const LinkedList = require('../classes/linked-list;
const bodyParser = express.json()


languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })
        // console.log(language)
      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const head = await LanguageService.getHead(
        req.app.get('db'),
        req.language.head, 
      )
      let responseObj = {
        totalScore: req.language.total_score, 
        wordCorrectCount: head.correct_count, 
        wordIncorrectCount: head.incorrect_count, 
        nextWord: head.original
      }
      
      res.json(responseObj)
      next()
    }
    catch(error) {
    next(error)
    }
  })


languageRouter
  .post('/guess',bodyParser,  async (req, res, next) => {
    // pulling request out of body
      let {guess} = req.body; 
     
      if(!guess || guess === '') {
        return res.status(400).json({error: `Missing 'guess' in request body`})
      }
      try {

        // grab the currentHead to compare and for total_score_data
        const head = await LanguageService.getHead(
          req.app.get('db'),
          req.language.id
        )
        // console.log('This is the head', head)
       
        // get total words to use for correct and incorrect answers

        const words = await LanguageService.getLanguageWords(
          req.app.get('db'),
          req.language.id
        )
        // checking to see if I have a words list
        // console.log('this is words',words)

        // set all words into a linked list starting with the head 
        // put current head node aside

        let wordsLinkedList = new LinkedList();
        // console.log('this is a linked list instance', wordsLinkedList)

        // this is the current head for request body
        let currentNodeID = req.language.head
        // console.log('this is a head', currentNodeID)

        // loop through the words array 
        for (let i = 0; i < words.length; i++) {
          // console.log('this is the words array', words)

          let currentNodeItem = words.find(item => {
            // console.log('Find the ID of each item and assign it to the current head:', item.id)
            return item.id === currentNodeID            
          });
          // 
          // console.log('This is Node ID:', currentNodeID)

        let addItem = {
          id: currentNodeItem.id,
          language_id: currentNodeItem.language_id,
          original:currentNodeItem.original, 
          translation: currentNodeItem.translation, 
          memory_value: currentNodeItem.memory_value, 
          correct_count: currentNodeItem.correct_count, 
          incorrect_count: currentNodeItem.incorrect_count
        };
        // console.log('Object', addItem)
        // console.log('This is the language ID of a given node', currentNodeItem.language_id)
        // console.log('This is the original word of a give node', currentNodeItem.original)
        // console.log('This is the translation', currentNodeItem.translation)
        // console.log('This is the memory value', currentNodeItem.memory_value)
        console.log('This is the correct count', currentNodeItem.correct_count)
        // console.log('This is the incorrect count', currentNodeID.incorrect_count)
        
        // console.log(wordsLinkedList)
        wordsLinkedList.insertLast(addItem)
        currentNodeID = currentNodeItem.next;

      }
      // this is a duplicate 
      let originalHead = wordsLinkedList.head;
            // console.log('this is the original head', originalHead)


      // compare if guess is true or false
      if(guess.toLowerCase() != head.translation.toLowerCase()) {
        // console.log('yes')
        // wrong guess
        let next = words.find(item => item.id === head.next);
                // console.log('this is next', next)

        head.memory_value = 1;

        // set db and linkedList to new information

        //incorrect count increase 

        originalHead.value.incorrect_count = originalHead.value.incorrect_count + 1;

        // head to next
        // next to old head
        //old head to next's next

        // 
        wordsLinkedList.head = wordsLinkedList.head.next; // head to 1


        let tempNode = wordsLinkedList.head.next; // = 2
        wordsLinkedList.head.next = originalHead; // 1 -> 2
        originalHead.next = tempNode;

        await LanguageService.updateHead(req.app.get('db'), req.language.id, head.next)

        // we want to update each word in the database

        let currentNodeCycle = wordsLinkedList.head;
        while (currentNodeCycle != null) {
          let updateObj = {
            memory_value: currentNodeCycle.value.memory_value,
            correct_count: currentNodeCycle.value.correct_count, 
            incorrect_count: currentNodeCycle.value.incorrect_count, 
            next: currentNodeCycle.next != null ? currentNodeCycle.next.value.id : null
          }


          await LanguageService.updateWord(req.app.get('db'), req.language.id, currentNodeCycle.value.id, updateObj.memory_value, updateObj.correct_count, updateObj.incorrect_count, updateObj.next)
          currentNodeCycle = currentNodeCycle.next;
        }
        // console.log(req.language)
          res.status(200).json({
          nextWord: next.original,
           wordCorrectCount: next.correct_count,
           wordIncorrectCount: next.incorrect_count, 
           totalScore: req.language.total_score, 
           answer: head.translation, 
           isCorrect: false
           })


      }
      else { 
        let next = words.find(item => item.id === head.next)
        let nextOriginal = next.original;

        head.memory_value *= 2;


        let newTotalScore = head.total_score + 1
        // set database and linked list to new information
        await LanguageService.updateScore(req.app.get('db'), req.language.id, newTotalScore)

        //incorrect count increse 
        originalHead.value.correct_count = originalHead.value.correct_count + 1;
        originalHead.value.memory_value = originalHead.value.memory_value * 2;


        // head to next
        // old head to new position 

        wordsLinkedList.head = wordsLinkedList.head.next;
        wordsLinkedList.insertAtOrLast(originalHead.value , head.memory_value)
        await LanguageService.updateHead(req.app.get('db'), req.language.id, head.next);

        // update the words in database

        let currentNodeCycle = wordsLinkedList.head; 
        while (currentNodeCycle != null) {
          let updateObj = {
            memory_value: currentNodeCycle.value.memory_value, 
            correct_count: currentNodeCycle.value.correct_count, 
            incorrect_count: currentNodeCycle.value.incorrect_count, 
            next: currentNodeCycle.next != null ? currentNodeCycle.next.value.id : null
          }
          await LanguageService.updateWord(req.app.get('db'), req.language.id, currentNodeCycle.value.id, updateObj.memory_value, updateObj.correct_count, updateObj.incorrect_count, updateObj.next);
          currentNodeCycle = currentNodeCycle.next;
        }
          res.status(200).json({nextWord: nextOriginal, wordCorrectCount: next.correct_count, wordIncorrectCount: next.incorrect_count, totalScore: newTotalScore, answer:head.translation, isCorrect: true})
      }
      next()
      }
      catch(error) {
        next(error);
      }
  })

module.exports = languageRouter