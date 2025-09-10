// frontend/src/components/common/LoadingSpinner.jsx
function LoadingSpinner({ size = 'medium', inline = false }) {
  const sizes = {
    small: { width: '16px', height: '16px', borderWidth: '2px' },
    medium: { width: '24px', height: '24px', borderWidth: '3px' },
    large: { width: '40px', height: '40px', borderWidth: '4px' }
  }
  
  const spinnerStyle = {
    ...sizes[size],
    border: `${sizes[size].borderWidth} solid #f3f3f3`,
    borderTop: `${sizes[size].borderWidth} solid #007bff`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: inline ? 'inline-block' : 'block'
  }

  return (
    <>
      <div style={spinnerStyle} />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  )
}

export default LoadingSpinner
