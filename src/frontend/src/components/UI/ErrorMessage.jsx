import { memo } from 'react'

const ErrorMessage = memo(({ 
  message, 
  className = '',
  onRetry,
  ...props 
}) => {
  return (
    <div className={`error-message ${className}`} {...props}>
      <div className="error-message__content">
        <span className="error-message__icon">⚠️</span>
        <span className="error-message__text">{message}</span>
      </div>
      {onRetry && (
        <button 
          className="error-message__retry"
          onClick={onRetry}
        >
          Повторить
        </button>
      )}
    </div>
  )
})

ErrorMessage.displayName = 'ErrorMessage'

export default ErrorMessage
