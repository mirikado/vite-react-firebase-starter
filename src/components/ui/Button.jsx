export const Button = ({ variant = 'primary', className = '',...props }) => {
  const variants = {
    primary: 'btn-primary',
    danger: 'btn-danger',
    success: 'btn-success'
  }
  return <button className={`btn ${variants[variant]} ${className}`} {...props} />
}