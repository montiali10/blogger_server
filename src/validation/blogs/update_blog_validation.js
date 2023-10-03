const { body } = require('express-validator')

const updateBlogValidationRules = () => {
  return [
    body('title')
        .notEmpty()
        .withMessage('Title cannot be empty.')
        .isString()
        .withMessage('Title must be a text.')
        .isLength({ min: 5 })
        .withMessage('Title should be at least 5 characters.'),
    body('content')
        .notEmpty()
        .withMessage('Content cannot be empty.')
        .isString()
        .withMessage('Content must be a text.')    
        .isLength({ min: 5 })
        .withMessage('Content should be at least 5 characters.'),
    body('summary')
        .notEmpty()
        .withMessage('Summary cannot be empty.')
        .isString()    
        .withMessage('Summary must be a text.')
        .isLength({ min: 5 })
        .withMessage('Summary should be at least 5 characters.'),
    body('autherId')
        .notEmpty()
        .withMessage('Summary cannot be empty.')
        .isInt()    
        .withMessage('Summary must be an integer.')
  ]
}

module.exports = {
    updateBlogValidationRules
}