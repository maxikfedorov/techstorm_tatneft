// frontend/src/components/common/Button.jsx
function Button({ children, ...props }) {
  return <button {...props}>{children}</button>
}

export default Button
