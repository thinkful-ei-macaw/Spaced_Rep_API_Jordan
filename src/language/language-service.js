const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({
        language_id
      })
  },

  getHead(db, head) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({
        id: head
      })
      .first()
  },

  updateWord(db, language_id, word_id, memory_value, correct_count, incorrect_count, next) {
    let response = db('word')
      .where({
        language_id: language_id
      })
      .andWhere({
        id: word_id
      })
      .update({
        memory_value: memory_value,
        correct_count: correct_count,
        incorrect_count: incorrect_count,
        next: next
      })
    return response;
  },

  updateScore(db, language_id, totalScore) {
    let response = db('language').where({
      id: language_id
    }).update({
      total_score: totalScore
    })
    return response;
  },

  updateHead(db, language_id, head) {
    let response = db('language').where({
      id: language_id
    }).update({
      head
    })
    return response;
  }

}


module.exports = LanguageService